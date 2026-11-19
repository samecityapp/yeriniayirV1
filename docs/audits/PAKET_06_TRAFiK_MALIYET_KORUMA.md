# PAKET 06 — TRAFİK DAYANIKLILIĞI, MALİYET KORUMASI VE YÜK TESTİ HAZIRLIĞI

**Tarih:** 19 Kasım 2026 *(Fiyatlandırma dokümantasyonu doğrulama tarihi: 19 Kasım 2026)*  
**Taban Commit (`feat/paket-05-api-middleware-mobile`):** `2f7db0088ab11e6bdb8b9acccfbd5bb110933277`  
**Çalışma Dalı:** `feat/paket-06-traffic-cost-resilience`  
**Uygulama Commit SHA (`10` kod/test dosyası + rate-limit uzlaşısı `4` dosya):** `3692a97aa06bbb7e3525554674c3fba6791229fa` -> **`8ac9496a670a000bf4dd6cd42888c95b5802f569`**  
**İzole Çalışma Ağacı:** `/Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost` *(disk koruması nedeniyle `sparse-checkout` ile `public/images/articles/` ve `public/images/blog/` çalışma dizinine indirilmeden Git ağacında tam `2.689` dosya olarak korunmuştur)*  
**İlgili 48 Maddelik Kontrol Listesi Maddeleri:** `05, 06, 24–30, 31 (maliyet/alarm)`

> **NET KARAR ÖZETİ:**
> - **Yerel Kod Mimarisi ve Otomatik Dayanıklılık Testleri (`15/15` Kapı):** **GEÇTİ** — Çoklu-instance / CLI / UA-rotasyon / kesinti devre kesicisi, Codex `P1-01` (`https://*.upstash.io` + bozuk/eksik Upstash env için tek biçimli fail-closed `503`/`emergency-fallback` politika yolu) & `P2-01` (`expiresAt` son timestamp tabanlı rolling sliding-window + canlı kova koruma) kapatmaları, acil durum yük atma (`TRAFFIC_EMERGENCY_MODE=shed|lockdown`) ve `5.000` istekli kademeli yerel yük testleri (`Scenario A` + `Scenario B`) `0` `5xx`, `0` beklenmeyen `429`, `0` DB ve `0` Upstash tüketimiyle geçti (`8/8` Paket 06 kontrolü).
> - **Canlı Yayın Öncesi Genel Karar:** **ŞARTLI GEÇTİ** — **KALDI değil, doğrudan GEÇTİ de değil.** Yerel `127.0.0.1` loopback testleri tek bir Mac süreçte Next.js motorunu doğrulamıştır; ancak **gerçek Vercel global Edge/CDN PoP kapasitesi, mevcut Vercel/Supabase/Upstash hesap plan ve fatura kotaları ile Vercel/Supabase/Upstash panellerinde alarmların/limitlerin açıldığı henüz panel erişimi olmadığı için `Test edilemedi`.** Ayrıca [PAKET_04](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/docs/audits/PAKET_04_GUVENLIK_PERFORMANS_ENTEGRASYONU.md) bulgularındaki `origin/main` maruz Google anahtar iptali ve Vercel Preview/Production Supabase env ayrımı ön koşulları canlı yayın öncesi zorunludur. Production dağıtımı, `main` birleştirmesi ve `git push` yapılmamıştır.

---

## 1. Mevcut Maliyet Mimarisi (Aşama 1)

### 1.1 Ziyaretçi İşlemi → Tüketilen Servis Eşleştirmesi

| Ziyaretçi / Sistem İşlemi | Vercel CDN (Fast Data Transfer) | Edge Routing Middleware | Vercel Serverless / ISR Function | Vercel Image Optimization (`/_next/image`) | Supabase (DB / Auth / Egress) | Upstash Redis | Dış Harici API (Places / Harita / GA4) |
|---|---|---|---|---|---|---|---|
| **Gastronomi V5: `/`, `/tr`, `/en` açılışı** | Statik ISR HTML (`1h`) + JS/CSS + `/fonts/*.woff2` (`44,248 B`) + öne çıkan `11` SVG (`12,439 B` br toplam) | `1` çağrı (`/tr`), temiz `.woff2` & `.svg` için **`0` çağrı** | Sadece soğuk MISS veya `1h` revalidation'da **`1`** (sıcak CDN'de **`0`**) | **`0`** (`public/images/gastronomy/*.svg` doğrudan servis edilir; `VenueImage` fotoğraf olmadıkça inline SVG/img fallback) | **`0`** | **`0`** | `Maps`: `0` yük (dış link), `Places API`: **`0`**; Preview dışı GA4/Clarity istemci yükü (`$0`) |
| **Gastronomi V5: Konum / Semt seçimi (`Moda -> 92 bölge`)** | Bölge statik JSON (`/api/gastronomy/regions/[slug]`, `12,465 B` br ort., `61,093 B` ham `moda`) | `1` hafif geçiş (yönetici değil, **`0` Upstash**) | `force-static` `92` SSG yolu + `dynamicParams=false` (**CDN hit'te `0`**) | **`0`** | **`0`** | **`0`** | **`0`** (tarayıcıda bellek `Map` + `inFlightRequests` önbellekli) |
| **Gastronomi V5: Kategori değişimi & Mekan detay & Yol tarifi** | Yalnız yeni kategori `.svg` ilk kez yüklenirse (`~1,270 B` br ort.); geri dönüşler **`0 B`** | **`0`** | **`0`** | **`0`** | **`0`** | **`0`** | Yönlendirme tıklaması harici `https://maps.google.com/?cid=...` linkidir (`$0` API) |
| **Gastronomi V5: `Konumumu Kullan` (GPS)** | **`0`** | **`0`** | **`0`** | **`0`** | **`0`** | **`0`** | Yalnız tarayıcı `navigator.geolocation` + yerel `bbox` (`92` bölge) (`$0`) |
| **Eski / İkincil Yüzey: `/[lang]/search` (Otel Arama)** | Dinamik SSR HTML + JS | `1` çağrı | `1` SSR | İstemci `<Image>` otel kapakları varsa | İstemci doğrudan `loadHotelSearchCatalog()` (**3 tablo × limit 50–100**, `5 dk` bellek cache) | **`0`** | Pexels/Unsplash/eski Supabase URL'leri |
| **Eski / İkincil Yüzey: `/[lang]/otel/[id]`, `/rehber/*`, `/[lang]/[slug]`, `/feed.xml`** | `revalidate = 3600` (`1h`) | `1` çağrı | ISR (`1h` başına en fazla `1` origin yenileme) | `opengraph-image.tsx` (Edge Satori PNG; geçersiz ID artık `404`, **`0` DB**) + otel galerisi | `hotels` / `articles` / `offers` SELECT + `<Footer />` cache'li makale | **`0`** | Otel detayda `PageViewTracker` → `/api/track-event`; Leaflet OSM tile |
| **Eski / Dinamik API'ler: `/api/go`, `/api/track-event`, `/api/gastronomy-public`** | `no-store` (CDN yok) | `1` Edge Memory Shield (`0` Upstash) | Her istek `1` Node Serverless Function | **`0`** | `go` (click INSERT + hotel SELECT); `track-event` (INSERT, 60s dedupe); `public` (RPC cache'li) | Geçerli istekte `1–2` komut (erken `400` ve Katman-1 sel kalkanında **`0`**) | **`0`** |
| **Çevrimdışı İçerik Üretim CLI (`scripts/`)** | **`0`** | **`0`** | **`0`** | **`0`** | Yalnız açık onayla | **`0`** | Google Places (New) Enterprise mask (`Atmosphere` alanları kapalı; ziyaretçi akışından tamamen kopuk) |

### 1.2 Derlenmiş Dosya ve Veri Aktarımı Ölçümleri (`npm run build` + `.next` Analizi)

- **Gastronomi Kök Sayfası (`/[lang]`):** İlk Yükleme JS `148 kB` (`First Load JS shared by all: 103 kB`), `/tr` statik HTML **`171,280 B`** ham (`35,794 B` Gzip, **`32,688 B` Brotli**).
- **92 Bölge Statik JSON (`/api/gastronomy/regions/[slug]`):** Ortalama **`49,699 B`** ham (`12,826 B` Gzip, **`12,465 B` Brotli**); `moda`: `61,093 B` ham (`15,102 B` Gzip, `14,618 B` Brotli). `dynamicParams = false`, `revalidate = 3600` ile 92 yol `● (SSG)` önceden derlenmiştir.
- **Statik Görsel & Yazı Tipi:** `public/fonts/Inter-TR-EN-04308d9ab394.woff2` (`44,248 B`), `public/images/gastronomy/` içindeki `71` SVG (`460 KB` toplam; öne çıkan `11` bölge SVG'si toplam **`35,855 B`** ham / **`12,439 B`** Brotli).
- **Eski Otel Medya Ayak İzi (Gastronomi V5'ten Ayrı):** `public/images/articles` **`1.9 GB`**, `public/images/blog` **`117 MB`**, `public/images/demo-hotels` **`16 MB`**. Bunlar eski otel/blog sayfaları açıkça ziyaret edilmedikçe Gastronomi V5 ziyaretçilerine hiç indirilmez.
- **Middleware Derleme Boyutu:** `ƒ Middleware 110 kB` (`config.matcher` temiz statik `.svg`/`.woff2`/`.png`/`.jpg` & metadata dosyalarını çalıştırmadığı için yalnızca dinamik belge/API isteklerinde tetiklenir).

---

## 2. Fatura Şişmesine Karşı Koruma — 3 Senaryo ve Platform Sınırları (Aşama 2)

### 2.1 Üç Yüksek-Riskli Senaryonun Teknik Analizi

| Aşama | Senaryo 1: Gerçek Instagram Story Patlaması | Senaryo 2: Kötü Niyetli Bot & Otomatik İstek Saldırısı | Senaryo 3: Yazılım Hatası Nedeniyle Sürekli Tekrar |
|---|---|---|---|
| **İlk Uyarı Sinyali** | Vercel Analytics / Fast Data Transfer ve CDN `HIT` sayısında ani sıçrama; Edge Routing Middleware çağrılarının yükselmesi (`/tr` + bölge JSON'ları). | Yüksek **`429`** (`X-RateLimit-Policy: memory-l1 \| upstash`), **`400`** (bozuk URL/`hotelId`), **`404`** (bilinmeyen `/api/*` veya geçersiz `opengraph-image`) oranı; aynı `/24` veya tek IP'de yüksek CLI/UA rotasyonu; Upstash komut hızında artış. | İstemci hata loglarında aynı endpoint'e periyodik/hızlı `GET` ya da `POST` tekrarı; `PageViewTracker` veya `GastronomyPageClient` tarafında aynı URL için tekrarlayan 4xx/5xx/timeout dalgası. |
| **Tükenebilecek Kaynak** | Vercel Hobby ise **`100 GB`** Fast Data Transfer limiti ve **`1M`** Edge Middleware kotası; Pro ise Edge Middleware / Origin Transfer aylık kredisi. (Gastronomi V5'te Supabase/Upstash tükenmez.) | Tarayıcı dışı bot `/api/go`, `/api/track-event`, `/[lang]/search` veya `/otel/[id]/opengraph-image` hedef alırsa Upstash Redis komut kotası, Node Serverless CPU ve Supabase bağlantı/egress kotası. | Dinamik `/api/*` uçlarına döngü olursa Upstash komut kotası ve Vercel Serverless GB-saat; bölge JSON'unda döngü olursa Edge Middleware + Fast Data Transfer. |
| **Maliyet Nasıl Artar?** | Gastronomi V5 CDN'de kaldığı sürece ziyaret başına ek **sunucu/DB maliyeti `~0`**, yalnızca Edge Middleware + CDN GB aktarımı artar; ancak Hobby plan aşılırsa site duraklatılır. | Sınırsız bot rastgele `?hotelId=bad`, `?q=%bad` veya her istekte yeni `User-Agent` / `slug` ile Supabase `.or(...)`, `opengraph-image` Satori render veya Upstash key sayısını patlatırsa değişken fatura yükselir. | Hatalı `fetch` retry döngüsü saniyede N kez 5xx/timeout üretip serverless/edge çağrı çarpanı oluşturabilir. |
| **Devreye Giren Kod Koruması** | `utm_*`/`fbclid` cache bölmez (`HIT`); `92` bölge statik JSON + bellek önbelleği; statik `.svg`/`.woff2` **`0` MW**; CGNAT korumalı cihaz anahtarı (sahte `429` yok). | Middleware anomali reddi (`400`/`404`/`405`), erken `400` (`go`, `gastronomy-public`, `track-event` = `0` DB/Upstash), CLI `6/10s` sınırı (`curl`/boş UA = `0` Upstash), **40-UA churn çökertmesi**, `admin` vs `visitor` izole bellek havuzları, `opengraph-image` & `db.ts` erken `404`/`null`. | `GastronomyPageClient` üzerinde **`5.000 ms` hata soğuma kilidi** (`failedRegionCooldownRef`) + `8000 ms` `AbortController`, `SearchFilters`/`GastronomyPageClient` gereksiz `pushState` atlama, `PageViewTracker` yalnızca otel detayında ve `60s` view deduplication (`track-event`), `Supabase` `8s/10s` abort timeout. |
| **Yönetici Müdahalesi Eşiği** | Hobby `>= %80` transfer/MW tüketimi veya Pro'da beklenmeyen bütçe alarmı (`%75`). | `429` dalgası Upstash bütçesinin `>= %70`'ine yaklaşırsa veya botlar farklı dağıtık IP'lerden eski otel/arama/resim rotalarını döverse (`TRAFFIC_EMERGENCY_MODE=shed` açılır). | Hata izlemede aynı rota > `1.000` hata/dk üretiyorsa ilgili route `TRAFFIC_EMERGENCY_MODE=shed` ile kesilir ve hatalı release geri alınır (`Rollback`). |
| **Toparlanma Süreci** | Trafik doğal seyrine indiğinde hiçbir müdahale gerekmeden **0 ms sıfır kalıntı**; yerel testte `3.000` istek sonrası 20 probe ortalama `4.88 ms` medyanla döndü. | Upstash kesintisinden dönüşte `10s` cooldown bitince otomatik Layer-2 Upstash senkronuna geçer; Vercel env kaldırılınca normal rotalar geri döner. | `failedRegionCooldownRef` kullanıcı **"Tekrar Dene"** basınca sıfırlanır veya 5 sn sonra temizlenir; `Rollback` sonrası ISR yenilenir. |

### 2.2 Vercel, Supabase ve Upstash Bütçe Alarmları vs Gerçek Üst Sınır Değerlendirmesi

*(Kaynaklar: resmî Vercel Pricing & Spend Management dokümantasyonu, Supabase Pricing & Spend Cap dokümantasyonu, Upstash Redis Pricing dokümantasyonu — **19 Kasım 2026** doğrulaması)*

1. **Vercel Spend Management ve "Pause Production Deployments":**
   - **Kritik Uyarı:** Vercel Pro planında (`$20/ay`) **Spend Management bütçe uyarıları (`50%/75%/100%` bildirim & webhook) tek başına senkron bir fatura durdurucu DEĞİLDİR** — fatura akışını kesmek için proje/takım ayarında **"Pause production deployments"** seçeneğinin açık olması gerekir.
   - **Gecikme ve Erişilebilirlik Etkisi:** Vercel kullanım ölçümü yaklaşık-gerçek zamanlı (asenkron) çalıştığı için ani saniyelik büyük saldırılarda küçük bir taşma payı oluşabilir; ayrıca duraklatma devreye girdiğinde yalnızca pahalı uçlar değil **tüm site çevrimdışı kalır**. Bu yüzden kodumuzdaki `TRAFFIC_EMERGENCY_MODE=shed` katmanı Vercel pause tetiklenmeden önce yalnızca pahalı/eski uçları kapatıp Gastronomi V5 vitrinini ayakta tutmak için tasarlanmıştır.
   - **Hobby Plan Riski (`$0`):** İlk 100 GB Fast Data Transfer kotası aşılırsa fatura çıkmaz ama proje döngü sonuna kadar duraklatılır; ticari üretim trafiği için Hobby plan kullanım şartlarına uygun değildir.
2. **Supabase Spend Cap (Harcama Üst Sınırı):**
   - **Free Plan (`$0`):** `5 GB` uncached + `5 GB` cached egress limiti vardır; aşılırsa ek fatura kesilmez fakat proje kısıtlanır/askıya alınır.
   - **Pro Plan (`$25/ay`):** `250 GB` uncached + `250 GB` cached egress içerir; **Spend Cap varsayılan olarak AÇIKTIR (`ON`)** — kota dolduğunda ek GB ücreti (`$0.09/GB` uncached, `$0.03/GB` cached) yazmaz, hizmeti sınırlar (Spend Cap kapatılırsa pay-as-you-go yazar). Gastronomi V5 sayfaları çalışma zamanında `0` Supabase çağrısı yaptığından eski `/search` veya `/otel/*` dışında Instagram trafiği Supabase Spend Cap'ini zorlamaz.
3. **Upstash Redis Max Monthly Budget:**
   - **Free (`$0`):** Aylık `500.000` komut / `250 MB` limitlidir; **Pay-As-You-Go:** **`$0.20 / 100.000` komut** (resmî fiyat, 19 Kasım 2026).
   - **Max Budget Sınırı:** PAYG veritabanlarında **Max Monthly Budget** belirlendiğinde `%70` ve `%90` uyarı e-postaları gönderilir ve üst sınıra ulaşılınca ekstra ücret kesmek yerine komutları rate-limit eder. Upstash rate-limit kesintiye girdiğinde kritik admin uçlarımızın güvenli davranışı aşağıdaki Aşama 3'te sertleştirilmiştir.

---

## 3. Rate-Limit Mimarisi Yeniden Denetimi ve Yapılan Düzeltmeler (Aşama 3)

Paket 05 ([rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimit.ts), [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/middleware.ts)) üzerinde yapılan yeniden denetimde **6 temel mimari sorunun dürüst yanıtları ve kapatılan açıklar**:

| # | Denetim Sorusu | Dürüst Durum Tespiti (Önce) | Uygulanan Sertleştirme ([rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimit.ts) & [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/middleware.ts)) |
|---|---|---|---|
| **1** | **Bellek tabanlı koruma farklı Vercel instance/Edge bölgelerinde ortak çalışıyor mu?** | **HAYIR.** `Map` havuzları yalnızca aynı sıcak V8 isolate'i paylaşır (`verify_paket06` `1.1` bunu kanıtladı: Upstash olmadan 2 isolate = `16` izin). Yalnız Layer-2 Upstash globaldir. | Tek başına Edge bellek korumasına güvenilmez; tüm dağıtık sınırlar **Upstash Redis** üzerinden ortaklaşır, admin API middleware çağrıları `'edge-shield'` ile optimize edilip **Upstash komut sayısı yarıya indirildi** (`1` Upstash/istek). Ayrıca **`adminBuckets` (`1024`), `ipCeilingBuckets` (`2048`), `visitorDeviceBuckets` (`4096`) üç ayrı izole havuza** bölünerek hiçbir havuzun diğerini kovmaması (`never evict live counters`) sağlandı. |
| **2** | **Upstash kesintisinde global sınır korunuyor mu?** | **HAYIR (Per-Instance Sınırdır).** Upstash düştüğünde dağıtık bir saat/sayıcı olmadığı için `emergency-fallback` `3/60s` IP, `6/60s` küresel sınırı her isolate başına ayrı çalışır. | `APP_ENVIRONMENT === 'production'` veya `VERCEL_ENV === 'production'` iken kritik `admin_auth` ve `costly_admin` uçlarında **varsayılan davranış fail-closed `503 outage-blocked`** (`resolveCriticalOutageMode() === 'block'`) haline getirildi (`Check 1.3`). Ayrıca [rateLimitConfig.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimitConfig.ts) (`validUpstashConfig`: yalnız `https://<id>.upstash.io`, port/path/query/userinfo/whitespace yok) ve eksik/bozuk env ile runtime kesintisini **aynı `handleCriticalOutageFallback` kapısına** bağlayan politika Codex `P1-01` bulgusunu kapattı (hem `block`=`503`, hem `emergency`=`6/60s` global). Ek olarak `10.000 ms` Upstash devre kesici soğuma (`upstashOutageUntil`) eklendi (`<25 ms` hızlı red). |
| **3** | **IP başına sınırlar Instagram CGNAT ziyaretçilerini engelliyor mu?** | **Gastronomi V5 ana akışında HAYIR (`0` rate-limit).** Dinamik `/api/go`, `/api/track-event`, `/api/gastronomy-public` ise yüksek (`120–150/10s` ham IP tavanı) sınır kullanıyor; yine de `VERCEL=1` iken istemcinin gönderdiği `x-forwarded-for` spoofing'e açıktı. | `extractClientIp()`, `process.env.VERCEL === '1'` iken güvenilir **`x-vercel-forwarded-for`** -> `x-real-ip` sırasını kullanır (spoofable `x-forwarded-for` yoksayılır). Gastronomi statik/ISR `/tr` & `/api/gastronomy/regions/*` uçları rate-limit dışındadır (`Scenario A` & `B`: `0` adet `429`). |
| **4** | **Tek cihazdan çok sayıda otomatik istek yapılabiliyor mu?** | **KISMİ AÇIK VARDI.** `curl/8.4.0`, `python-requests` veya boş `User-Agent` ile gelen tek bot `30/10s` alabiliyor; her istekte rastgele `User-Agent` döndüren tek IP ise Katman-1'de `N` ayrı hash üretip **Upstash komut faturasını şişirebiliyordu**! Also rolling window `expiresAt` eski kodda en eski timestamp'e bağlı olduğundan newer burst'leri erken düşürebiliyordu (`P2-01`). | **`isAutomatedCliUserAgent` (`6/10s` CLI sınırı):** Boş/kısa (`<4`) veya CLI/bot UA'lar için Layer-1'de **`6/10s`** alt tavanı zorunlu (`0` Upstash). **UA-Rotasyon Çökertmesi (`MAX_DISTINCT_UAS_PER_IP_WINDOW = 40`):** `ipUaSets` canlı izleyici silmeden (`purgeExpiredEntries`) 41+ UA'yı `${ipHash}:ua-churn`'e çökertir. **Kayan Pencere Düzeltmesi (`P2-01`):** `expiresAt = sonTimestamp + windowMs` + taşmada canlı kova silmeme (`Check 1.5` saat sınırı kanıtı: `t=10001ms`'de `1` kabul / `29` ret). |
| **5** | **Sunucu yeniden başladığında (cold-start) koruma davranışı değişiyor mu?** | **EVET.** Cold-start'ta `Map` sıfırlanır; önceki kodda Production'da Upstash env eksikse `enforceRateLimit` kritik uçları bile `l1`'e düşürüyordu (`!upstashCfg -> return l1`). | Cold-start'ta bellek sıfırlansa da Layer-2 **Upstash** kalıcı durumu korur; Production'da `UPSTASH_REDIS_REST_*` eksik veya bozuksa kritik uçlar (`admin_auth`, `costly_admin`) artık cold-start'ta bile **fail-closed `503 outage-blocked`** döner (`Check 1.3`). |
| **6** | **Kritik API uçlarında fail-closed yaklaşımı gerekli mi?** | **EVET.** Kaba kuvvet MFA/login denemesi (`/api/gastronomy-admin/login`), içerik yayınlama (`/publish`, `/research`) ve `service_role` yazma (`createOffer/updateOffer/deleteOffer`) çoklu-instance ortamda Upstash yokken bellek resetine güvenmemelidir. | `admin_auth` + `costly_admin` Production'da varsayılan **fail-closed `503`** (`outage-blocked`), ziyaretçi statik rehber ve genel uçlar ise kullanılabilirlik lehine **graceful / Katman-1 + emergency-fallback** olarak ayrıldı. |

Ek tarama & DoS kapanışları:
- [lib/db.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/db.ts): `hotels.getById` geçersiz UUID ve `isSupabaseIsolated` durumunda `0` Supabase çağrısı; `articles.getBySlug` katı `^[a-z0-9-]{1,120}$` doğrulamasıyla hem sahte URL taramalarını hem PostgREST `.or(...)` filtre sözdizimi enjeksiyonunu engeller; `articles.getAllByLocation` `.limit(20)` ve izolasyon koruması aldı.
- [otel/[id]/opengraph-image.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/app/%5Blang%5D/(main)/otel/%5Bid%5D/opengraph-image.tsx) & [rehber/[slug]/opengraph-image.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/app/%5Blang%5D/(main)/rehber/%5Bslug%5D/opengraph-image.tsx): Geçersiz ID/slug taramaları DB ve Edge PNG Satori CPU maliyetine girmeden `404` (`s-maxage=300`) döner (`Check 1.4`).

---

## 4. Kontrollü Yerel Yük Testi Sonuçları (Aşama 4)

> **ÖNEMLİ METODOLOJİ NOTU:** Bu testler tek bir yerel makinede (`127.0.0.1` loopback, socket egres kilidi aktif `network-lock.cjs`) derlenmiş `next start` sunucusu üzerinde çalıştırılmıştır (`work/paket06-load-benchmark.json`). **Bu sonuçlar gerçek Vercel global Edge CDN PoP kapasitesini, uluslararası ağ gecikmesini veya çoklu-bölge Serverless otomatik ölçeklemesini kanıtlamaz; yalnızca uygulamanın kendi sunucu motorunun sıcak/eşzamanlı yük altındaki kararlılığını, `0` DB/`0` Upstash maliyet profilini ve toparlanmasını kanıtlar.**

### 4.1 Senaryo A — Binlerce Kullanıcının Aynı Moda / Kadıköy Bağlantısını Açması (`3.000` İstek + `20` Toparlanma)
*(Karışım: `/tr?region=moda&utm_source=instagram&fbclid=...`, `/tr?region=moda`, `/api/gastronomy/regions/moda`, `/api/gastronomy/regions/kadikoy`, `bolge-moda.svg`, `Inter-...woff2`; `10` CGNAT IP, farklı Instagram UA'ları; ısınma sonrası başlangıç bellek RSS: `293.5 MB`)*

| Kademe | Eşzamanlı (`c`) | İstek Sayısı | Süre (ms) | Hız (`RPS`) | `p50` (ms) | `p95` (ms) | `p99` (ms) | Max (ms) | `5xx` / Beklenmeyen `429` | Next Cache `HIT` *(öngörülen %66.7 HTML+JSON)* | Veri Aktarımı | Peak RSS / CPU |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **A1** | `10` | `200` | `194.8` | `1,026.6` | `6.5` | `22.49` | `24.28` | `27.74` | **`0` / `0`** | `134` (`0 MISS`) | `17.48 MB` | `322.3 MB` / `%122.0` |
| **A2** | `50` | `800` | `614.8` | `1,301.3` | `19.63` | `75.62` | `397.81` | `532.31` | **`0` / `0`** | `534` (`0 MISS`) | `69.42 MB` | `392.3 MB` / `%133.4` |
| **A3** | `150` | `2,000` | `1,214.5` | **`1,646.8`** | `25.67` | `315.94` | `1,200.62` | `1,211.29` | **`0` / `0`** | `1,334` (`0 MISS`) | `173.29 MB` | `446.1 MB` / `%133.4` |
| **Toparlanma** | `4` | `20` | `24.4` | `820.1` | **`4.88`** | **`7.47`** | `7.47` | `7.98` | **`0` / `0`** | `20 / 20 HIT` | `2.32 MB` | `449.5 MB` / `%114.7` |

- **Supabase Sorgusu:** **`0`** · **Upstash Redis Komutu:** **`0`** · *(Not: Yanıtların kalan %33.3'ü doğrudan diskten dönen `.svg`/`.woff2` statik dosyalarıdır; cache edilebilir tüm SSR/SSG yanıtların `%100`'ü `x-nextjs-cache: HIT` olmuştur.)*

### 4.2 Senaryo B — Farklı Şehir / Semtler (`22` Bölge), Filtre ve Mekan Detayı (`2.000` İstek + Chrome `390px` E2E + `20` Toparlanma)
*(Karışım: `/`, `/tr?utm_source=instagram&fbclid=story_b`, `22` bölge JSON'u, `4` kategori SVG'si)*

| Kademe | Eşzamanlı (`c`) | İstek Sayısı | Süre (ms) | Hız (`RPS`) | `p50` (ms) | `p95` (ms) | `p99` (ms) | Max (ms) | `5xx` / Beklenmeyen `429` | Next Cache `HIT` *(öngörülen %85.7 HTML+JSON)* | Veri Aktarımı | Peak RSS / CPU |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **B1** | `10` | `200` | `133.9` | `1,493.6` | `3.89` | `20.14` | `27.2` | `36.75` | **`0` / `0`** | `172` (`0 MISS`) | `12.09 MB` | `449.5 MB` / `%113.5` |
| **B2** | `50` | `600` | `315.0` | `1,905.0` | `7.78` | `142.12` | `263.65` | `295.88` | **`0` / `0`** | `516` (`0 MISS`) | `35.79 MB` | `471.7 MB` / `%128.7` |
| **B3** | `120` | `1,200` | `580.7` | **`2,066.3`** | `9.46` | `440.46` | `511.31` | `578.66` | **`0` / `0`** | `1,032` (`0 MISS`) | `71.36 MB` | `507.3 MB` / `%133.4` |
| **Toparlanma** | `4` | `20` | `23.1` | `867.3` | **`3.48`** | **`7.1`** | `7.1` | `10.68` | **`0` / `0`** | `20 / 20 HIT` | `2.43 MB` | `472.1 MB` / `%3.6` |

- **Mobil Chrome (`390x844`) Akış Doğrulaması (`Check 2.2`):** `Moda, Kadıköy` -> `Gaziantep` -> `Alsancak, Konak` geçişleri, kategori sekmesi filtreleme, mekan detay açılışı ve Google Maps CID doğrulaması (`https://maps.google.com/?cid=2720703631499894683`): toplam `46` loopback istek, **`0` `/api/track-event`**, **`0` `/_next/image`**, **`0` console/sayfa hatası**, **`0` DB**, **`0` Upstash**.

---

## 5. `1.000` / `10.000` / `100.000` / `1.000.000` Ziyaret Maliyet Modelleri

**Model Varsayımları (Ölçülen Boyutlara Dayalı — Birim Fiyatlar 19 Kasım 2026 Resmî Sağlayıcı Dokümanlarından):**
- **Aktif Gastronomi V5 Ziyareti Başına Yük:** Ortalama `1` ana HTML (`~32.7 KB` br) + `1.5` bölge JSON (`~18.7 KB` br) + paylaşılan First Load JS/CSS (`~148 KB`) + font (`44.2 KB`) + SVG'ler (`~5–13 KB`) ≈ **soğuk tarayıcı önbelleğinde en fazla `~0.30 MB/ziyaret`** (`~0.15 MB` tekrarlı ziyaretlerde), **`2.5` Edge Routing Middleware çağrısı** (`/tr` + `1.5` JSON; `.svg` & `.woff2` `0` MW), **`0` Vercel Function/SSR** (CDN HIT durumunda; `1h` ISR yenileme ayda/saatte yalnızca bölge başına 1 hit ekler), **`0` Supabase komutu**, **`0` Upstash komutu**.
- **Birim Fiyatlar (19 Kasım 2026 doğrulaması):** Vercel Pro `$20/ay` (`1 TB` Fast Data Transfer, aşım `$0.15/GB`; `1M` Edge Middleware dahil kabulüyle aşım `~$0.65 / 1M` — kullanıcının kendi güncel Vercel plan limiti & aylık kullanım kredisi panelden teyit edilmelidir); Supabase Pro `$25/ay` (`250 GB` uncached + `250 GB` cached, aşım `$0.09/$0.03 per GB`, varsayılan Spend Cap aktif); Upstash PAYG `$0.20 / 100K` komut (Free `500K/ay`).

### Tablo A — Yalnız Aktif Gastronomi V5 Akışı (Optimize Edilmiş Statik / ISR Akışı)

| Ölçek | Fast Data Transfer (Soğuk Üst Sınır) | Edge Middleware Çağrısı (`2.5x`) | Serverless SSR / ISR Yenileme | Supabase & Upstash Tüketimi | Vercel Hobby (`$0`) Durumu | Vercel Pro (`$20/ay` Sabit) Üzerine Ek Değişken Fatura Tahmini |
|---|---|---|---|---|---|---|
| **1.000 ziyaret** | `~0.30 GB` | `~2.500` | `~1–95` (yalnız saatlik ISR dolumu) | **`$0` (`0` sorgu/komut)** | Dahil kota içi (`<$0` ek) | **`$0.00`** (dahil kota içi) |
| **10.000 ziyaret** | `~3.0 GB` | `~25.000` | `~1–95 / saat` | **`$0`** | Dahil kota içi | **`$0.00`** (dahil kota içi) |
| **100.000 ziyaret** | `~30 GB` | `~250.000` | `~95 / saat` | **`$0`** | `%30` kotada (sınıra yaklaşır) | **`$0.00`** (1 TB & 1M kotası içi) |
| **1.000.000 ziyaret** *(tümü soğuk önbellek)* | **`~300 GB`** *(tekrarla ~150–200 GB)* | **`~2.500.000`** | `~95 / saat` (sıcak CDN `%99.9+` HIT) | **`$0`** | **Hobby `100 GB` aşılır → Proje durur** *(ve ticari kullanım kısıtı)* | Transfer aşımı **`$0.00`** (`300 GB < 1 TB`); Edge MW ek `~1.5M × $0.65/1M` ≈ **`~$0.98`** (Pro aylık krediyle çoğu senaryoda karşılanır; Supabase `$0` + Upstash `$0`) |

### Tablo B — Eski Otel / Dinamik Rotalara Trafik Giderse (Önlemsiz Risk Karşılaştırması)
*(Örneğin 100.000 ziyaretçinin yalnızca %20'si bile = `20.000` kişi eski `/search`, `/otel/[id]` + `1.9 GB` `articles` görselleri + `/api/go` + `track-event` akışına yönlenseydi)*:
- `/api/track-event` & `/api/go`: Her geçerli istek `1–2` Upstash + `1` Node Serverless + `1–2` Supabase sorgusu üretir (`20.000` ziyaret ≈ `20–40K` Upstash komutu; saldırgan `5M` istek denemez ve `l1` keserse Upstash kotası korunur, ancak `40` UA rotasyonu eski koda karşı olsaydı milyonlarca Upstash komutu oluşabilirdi).
- Eski Otel `public/images/articles/*` (ortalama görsel `1–2 MB` PNG/JPG boyutları nedeniyle Gastronomi V5'in `~1.3 KB` Brotli SVG'lerinden **~1.000× daha ağırdır**): Yüksek trafik eski `/rehber/*` sayfalarına akarsa Vercel Image Optimization veya Fast Data Transfer çok hızlı `1 TB` kotasına yaklaşabilir — bu nedenle **Aşama 5 Acil Durum Planı** acil durumda bu yolları `503` ile kapatıp çekirdek Gastronomi V5'i izole korur.

---

## 6. Uygulanabilir Acil Durum Planı (Operasyon Runbook — Aşama 5 — Düzeltilmiş Mimari Not)

> **DÜZELTİLMİŞ MİMARİ NOT (Vercel Env vs. 0-Deploy Müdahale):** Vercel üzerinde `TRAFFIC_EMERGENCY_MODE` gibi standart Environment Variable değişiklikleri mevcut canlı deployment'a kendiliğinden yansımaz; geçerli olması için **Vercel Dashboard'dan Redeploy (`~1–2 dk`)** gerekir. Bu nedenle kod, deploy gerektirmeyen anlık müdahale için ek olarak mevcut **Upstash Redis (`ya:pilot:emergency_mode`) runtime anahtarını** (`<= 15 sn` izole önbellekle, çekirdek Gastronomi V5 ziyaretlerinde `0` Upstash çağrısıyla) destekler.

Acil bir maliyet alarmı, yavaşlama veya bot saldırısında operatörün uygulayabileceği kademeli müdahale planı ([emergencyMode.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/emergencyMode.ts)):

1. **Seviye 1 — Anlık Yumuşak Yük Atma (0-Deploy: Upstash `SET ya:pilot:emergency_mode shed EX 3600` · Redeploy Yedeği: Vercel `TRAFFIC_EMERGENCY_MODE=shed` + Redeploy):**
   - **Ne zaman:** Vercel/Upstash/Supabase alarmı `%70–%80`'i geçtiğinde veya eski otel/arama/görsel/analitik rotalarına yüksek yük geldiğinde.
   - **Ne kapanır:** `/[lang]/search`, `/[lang]/otel/*`, `/[lang]/rehber*`, `/[lang]/feed.xml`, `/[lang]/[slug]`, `/_next/image*`, `/api/go`, `/api/gastronomy-public`, `/design-demo`, `/preview-food-card`, `/fethiye-yemek-rehberi` → **`503` (`Retry-After: 120`, `X-Emergency-Mode: shed`, `0` DB, `0` Image Opt)**; `POST /api/track-event` → **`202 { shed: true }` (`0` Upstash, `0` DB)**.
   - **Ne ÇALIŞMAYA DEVAM EDER:** Kök sayfalar (`/`, `/tr`, `/en`), tüm `92` bölge JSON'u (`/api/gastronomy/regions/[slug]`), mekan kartları, tam sokak/cadde adresi, `Konumumu Kullan` GPS ve **`https://maps.google.com/?cid=...` yol tarifi CTA'ları `0` Upstash çağrısıyla %100 çalışır.** (`Check 3.1` ile derlenmiş `.next` + Puppeteer Mobile Chrome üzerinde `0` hata ile doğrulandı.)
2. **Seviye 2 — Tam Saldırı & Admin Mutasyon Kilidi (0-Deploy: Upstash `SET ya:pilot:emergency_mode lockdown EX 3600` · Kalıcı: Vercel `TRAFFIC_EMERGENCY_MODE=lockdown` + `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` + Redeploy):**
   - **Ne zaman:** Yönetici uçlarına yönelik DDoS veya Upstash kesintisi sırasında yetkisiz zorlama tespit edildiğinde.
   - **Ek koruma:** Seviye 1'e ek olarak `/api/gastronomy-admin/publish`, `/research` ve `createOffer`/`updateOffer`/`deleteOffer` yazma aksiyonları **`503`** döner; Production'da Upstash çöktüğünde tüm kritik admin/auth uçları `503 outage-blocked` olarak tamamen kapanır. Temel Gastronomi V5 ziyaretçi akışı yine ayakta kalır.
3. **Seviye 3 — Platform Firewall / Son Çare (0-Deploy Platform Kontrolü):**
   - **Vercel Firewall / Attack Challenge Mode:** Belirli ülke/ASN veya path saldırısında Vercel Project Settings → Security → Attack Challenge Mode deploy beklemeden anında açılır.
   - **Vercel "Pause Production Deployments":** Yalnız fatura üst sınırı tehlikeye girdiğinde devreye alınır (tüm siteyi durdurur).
   - **Müdahale Sonrası Geri Dönüş:** Upstash'ta `DEL ya:pilot:emergency_mode` (veya `SET ... off`) çalıştırılır ve tanımlandıysa `TRAFFIC_EMERGENCY_MODE` kaldırılıp yeniden deploy alınır.

---

## 7. Vercel / Supabase / Upstash / Google Cloud Panellerinde Kullanıcıdan Gereken İşlemler

Aşağıdaki ayarlar harici bulut panellerinde olduğundan ajan tarafından uygulanamamıştır; canlı duyuru öncesi kullanıcı tarafından bizzat yapılıp doğrulanmalıdır:

1. **Vercel Dashboard → Team / Project Settings:**
   - **Billing & Plan:** Canlı trafik öncesi **Pro plan (`$20/ay`)** aktifliğini doğrulayın (Hobby `100 GB` & ticari olmayan kullanım şartı Instagram lansmanı için uygun değildir).
   - **Spend Management:** Aylık bütçe limiti belirleyin, `%50 / %75 / %100` bildirim e-postası/webhook kurun ve tam bütçe güvencesi istiyorsanız **"Pause production deployments"** kararını netleştirip açın.
   - **Environment Variables (Kapsam Ayrımı & Sır Olmadan Kontrol):** `APP_ENVIRONMENT` (Production: `production`, Preview: `staging`/`preview`), `SUPABASE_PRODUCTION_AUTHORIZED=1` (yalnız Production'da), `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (Production'da mutlaka tanımlı olmalı — tanımlanmazsa yeni kod `admin_auth`/`costly_admin`'i `503` ile güvenli kapatır!), isteğe bağlı acil anahtar `TRAFFIC_EMERGENCY_MODE` (`off` veya tanımsız).
   - **Security:** Firewall altında Attack Challenge Mode'u hızlı erişime hazır tutun.
2. **Supabase Dashboard (`jerkkxwgddujigsbeqwo` & `vhptlecaixpawtxnhsde`):**
   - **Billing & Spend Cap:** Production (`jerkkxwgddujigsbeqwo`) üzerinde Pro plan ve **Spend Cap = ON** olduğunu teyit edin; güncel Egress ve Storage (`662.8 MB`) tüketimini kontrol edin.
   - **Staging (`vhptlecaixpawtxnhsde`)** veritabanında `ya_is_admin` / MFA (`aal2`) ve 42 RESTRICTIVE RLS politikasını Paket 04 talimatlarına göre uygulayın.
3. **Upstash Console (Redis DB):**
   - Production için ayrı bir Upstash Redis veritabanı (`Free 500K` yeterli değilse `PAYG` + **Max Monthly Budget** belirlenmiş olarak) oluşturun ve `%70 / %90` bütçe uyarılarını aktif edin.
4. **Google Cloud Console (Önceki Paket 04 Ön Koşulu):**
   - `origin/main` ve eski Git geçmişinde açıkta görünen Google API anahtarlarını iptal edip yenileyin; Places CLI için IP/API kısıtı ve aylık bütçe uyarısı ekleyin.

---

## 8. Önceki ve Yeni Testlerin Regresyon Sonuçları (`15/15` Kapı — Son Kod Üzerinde `exit 0`)

| # | Doğrulama Komutu | Kapsam | Gerçek Sonuç | Durum |
|---|---|---|---|---|
| 1 | `node scripts/security/scan-secrets.cjs` *(ve `--ref=HEAD`)* | Takip edilen dosyalar | `2689` dosyada `0` kimlik bilgisi | **GEÇTİ** |
| 2 | `node scripts/security/policy-tests.cjs` | Ortam, URL/trailing-dot, capability, staging MFA & Vary | `74` kontrol | **GEÇTİ** |
| 3 | `node scripts/verify_rls_security.mjs` | İzole yerel PostgreSQL 17.11 UNIX soket RLS/MFA SQL | `20/20` | **GEÇTİ** |
| 4 | `node scripts/verify_pilot_security.cjs` | Pilot auth, middleware, CSRF ve payload kontrolleri | `48/48` | **GEÇTİ** |
| 5 | `node scripts/verify_staging_preflight.cjs` | İzole staging preflight yapılandırma kontrolleri | `8/8` | **GEÇTİ** |
| 6 | `node scripts/verify_production_ratelimit_config.cjs` | Production Upstash `https://<id>.upstash.io` şekil + `RATE_LIMIT_CRITICAL_OUTAGE_MODE=block` kontrolü | `PASS` | **GEÇTİ** |
| 7 | `node scripts/verify_v3_gastronomy.cjs` | 92 yayınlı bölge, 8 politika kapısı, V3.7 maliyet kalkanları | `21/21` | **GEÇTİ** |
| 8 | `node scripts/verify_visitor_content.cjs` | Ziyaretçi DTO allowlist & metin izolasyonu | `10/10` | **GEÇTİ** |
| 9 | `npx tsc --noEmit` | TypeScript tam kontrolü | `0` hata | **GEÇTİ** |
| 10 | `npm run build` | `.next` üretim derlemesi (`113/113` sayfa, `92` SSG JSON, `ƒ Middleware 110 kB`) | `exit 0` | **GEÇTİ** |
| 11 | `node scripts/cloud/verify_secret_leakage.cjs` | `.next/static` istemci paketlerinde sır taraması | `115` dosyada `0` sızıntı | **GEÇTİ** |
| 12 | `node scripts/verify_p0_security_fixes.cjs` | Server Action, CSRF, Cloud MFA, Preview/Prod DB izolasyonu, derlenmiş HTTP E2E | `25/25` | **GEÇTİ** |
| 13 | `node scripts/verify_paket03_perf_and_analytics.cjs` | ISR/SSG korunumu, `/api/track-event`, Chrome `390px` & `1440px` E2E | `7/7` | **GEÇTİ** |
| 14 | `node scripts/verify_paket05_api_middleware_mobile.cjs` | API envanteri, 25-cihaz CGNAT, 200 CGNAT seli, bypass, `2425` CID/bbox, Mobil Chrome/Safari E2E | `12/12` | **GEÇTİ** |
| 15 | [verify_paket06_traffic_cost_resilience.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/scripts/verify_paket06_traffic_cost_resilience.cjs) | Çoklu-isolate / 3-havuz / CLI `6/10s` / 40-UA churn / prod fail-closed `503` (eksik+bozuk+kesinti) & `emergency` `6/60s` / `10s` cooldown / kayan pencere `t=10001ms` + kova taşması / scanner `0`-DB / Scenario A `3.000` req / Scenario B `2.000` req + Chrome E2E / Acil `shed` & `lockdown` E2E | **`8/8`** | **GEÇTİ** |

---

## 9. İlgili 48 Maddelik Kontrol Listesi Durum Tablosu (`05, 06, 24–30, 31 maliyet/alarm`)

*(Not: Depo içinde numaralı harici 48 maddelik kontrol tablosu dosyası bulunmadığından bu numaralar Görev 6 yönergesindeki trafik dayanıklılığı, maliyet koruması, rate-limit sertleştirmesi, yük testi ve bütçe/alarm kapsamlarıyla eşlenmiştir; bulut panel erişimi gerektirenler açıkça `ŞARTLI GEÇTİ` / `Test edilemedi` olarak işaretlenmiştir.)*

| Kontrol Maddesi | Kapsam & Değerlendirme | Durum | Kanıt / Açıklama |
|---|---|---|---|
| **05** | CDN / Edge / Function / DB maliyet ayrımı ve ziyaret başına sıfır DB/Upstash hedefi | **GEÇTİ (yerel) / ŞARTLI GEÇTİ (canlı CDN)** | Gastronomi V5 ziyaret başına `0` Supabase & `0` Upstash doğrulandı (`Check 2.1–2.2`, `PAKET_03`); canlı Vercel `x-vercel-cache` panelden teyit edilmedi (`Test edilemedi`). |
| **06** | `1K / 10K / 100K / 1M` ziyaret ve fatura şişmesi risk modellemesi | **GEÇTİ** *(model & birim fiyat kaynaklı)* | §1.2 ölçülen boyutlar + §5 tablosu (19 Kasım 2026 Vercel/Supabase/Upstash resmî fiyatları). Güncel hesap planı & kredi teyidi §7'de istendi (`Test edilemedi`). |
| **24** | Gerçek Instagram Story CGNAT patlama dayanıklılığı (`Scenario A`: `3.000` istek) | **ŞARTLI GEÇTİ** *(yerel tamam, global CDN `Test edilemedi`)* | Yerelde `1,646.8 RPS`, `0` 5xx, `0` 429, `0` DB/Upstash, `4.88 ms` medyan toparlanma (`Check 2.1`). |
| **25** | Çoklu şehir / semt / filtre / detay yük dayanıklılığı (`Scenario B`: `22` bölge `2.000` istek + Chrome E2E) | **ŞARTLI GEÇTİ** *(yerel tamam, global CDN `Test edilemedi`)* | Yerelde `2,066.3 RPS`, `0` 5xx, `0` 429, `0` DB/Upstash (`Check 2.2`). |
| **26** | Çoklu-instance / cold-start rate-limit ortaklığı & Upstash kesinti fail-closed koruması | **GEÇTİ** | 2-isolate ortak Upstash kanıtı, `10s` outage cooldown, `validUpstashConfig` şekil doğrulaması (`https://<id>.upstash.io`), eksik/bozuk config dahil Production `admin_auth`/`costly_admin` `503 outage-blocked` (`Check 1.1`, `1.3`). |
| **27** | Tek cihaz CLI botu (`6/10s`), rastgele UA rotasyonu (`40`-UA churn çökertmesi), kayan pencere bütünlüğü ve 3 izole bellek havuzu | **GEÇTİ** | `curl/8.4.0` 7. istekte `0` Upstash; 4.500 IP seli `admin_auth`'u bozmaz; `P2-01` rolling 10s sınırında `1/29` (`t=10001ms`); 4.200 taşmada canlı kova silinmez (`Check 1.2`, `1.5`). |
| **28** | Güvenilir Edge IP okuma (`x-vercel-forwarded-for`), tarama / `.or(...)` enjeksiyonu & Edge PNG DoS engellemesi | **GEÇTİ** | [rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimit.ts), [db.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/db.ts), `opengraph-image.tsx` (`Check 1.2`, `1.4`). |
| **29** | Yazılım döngüsü koruması (`failedRegionCooldownRef` 5sn + 8sn timeout) ve önceki güvenlik/performans kazanımlarının korunması | **GEÇTİ** | [GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/components/food/GastronomyPageClient.tsx) + `15/15` regresyon kapısı (`exit 0`). |
| **30** | Uygulanabilir Acil Durum Planı (`TRAFFIC_EMERGENCY_MODE=shed|lockdown`) ile çekirdek gastronomi + CID yönlendirmenin ayakta kalması | **GEÇTİ** *(yerel E2E)* | `Check 3.1`: 8 ağır/eski uç `503` + `track-event` `202` iken `/tr` + `Moda` + detay + `CID` yönlendirme Chrome `390px`'te `0` hatayla çalıştı. |
| **31 (Maliyet/Alarm)** | Vercel Spend Management, Supabase Spend Cap, Upstash Max Budget ve bulut alarm eşikleri | **Test edilemedi (ŞARTLI GEÇTİ — hazır runbook)** | Bulut panellerine ajan erişimi yok; §2.2 teknik değerlendirmesi ve §7 panel kontrol adımları kullanıcı için hazırlandı. |

---

## 10. Değiştirilen Dosyalar, Commit SHA'ları ve Genel Sonuç

- **Taban Commit (`feat/paket-05-api-middleware-mobile`):** `2f7db0088ab11e6bdb8b9acccfbd5bb110933277`
- **Çalışma Dalı:** `feat/paket-06-traffic-cost-resilience`
- **Uygulama Commit #1 (`10` dosya, `2.686` takip edilen dosya Git'te korunarak):** `3692a97aa06bbb7e3525554674c3fba6791229fa`
  - *(Yeni)* [lib/pilot/emergencyMode.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/emergencyMode.ts)
  - [lib/pilot/rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimit.ts)
  - [middleware.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/middleware.ts)
  - [app/api/track-event/route.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/app/api/track-event/route.ts)
  - [app/\[lang\]/(admin)/jilinrime/teklif-yonetimi/actions.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/app/%5Blang%5D/(admin)/jilinrime/teklif-yonetimi/actions.ts)
  - [lib/db.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/db.ts)
  - [app/\[lang\]/(main)/otel/\[id\]/opengraph-image.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/app/%5Blang%5D/(main)/otel/%5Bid%5D/opengraph-image.tsx)
  - [app/\[lang\]/(main)/rehber/\[slug\]/opengraph-image.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/app/%5Blang%5D/(main)/rehber/%5Bslug%5D/opengraph-image.tsx)
  - [components/food/GastronomyPageClient.tsx](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/components/food/GastronomyPageClient.tsx)
  - *(Yeni)* [scripts/verify_paket06_traffic_cost_resilience.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/scripts/verify_paket06_traffic_cost_resilience.cjs)
- **Uygulama Commit #2 (`P1-01` & `P2-01` Uzlaşısı, `4` dosya):** **`8ac9496a670a000bf4dd6cd42888c95b5802f569`**
  - *(Yeni)* [lib/pilot/rateLimitConfig.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimitConfig.ts)
  - *(Yeni)* [scripts/verify_production_ratelimit_config.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/scripts/verify_production_ratelimit_config.cjs)
  - [lib/pilot/rateLimit.ts](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/lib/pilot/rateLimit.ts)
  - [scripts/verify_paket06_traffic_cost_resilience.cjs](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/scripts/verify_paket06_traffic_cost_resilience.cjs)
- **Denetim Raporu Commit'i (`feat/paket-06-traffic-cost-resilience`):** İlk rapor `c295aa6968fb0030a41bf835aa73ef2b3a86e8f0`, nihai `15/15` güncellemesi bu belgeyi ([PAKET_06_TRAFiK_MALIYET_KORUMA.md](file:///Users/erdems/Documents/Codex/yeriniayir-paket06-traffic-cost/docs/audits/PAKET_06_TRAFiK_MALIYET_KORUMA.md)) güncelleyen izleyen commit.
- **Net Genel Karar:** **ŞARTLI GEÇTİ** *(Yerel kod, güvenlik, maliyet koruması ve `5.000` istekli kontrollü yerel yük testleri **15/15 GEÇTİ**; Vercel Pro/Spend Management, Supabase Spend Cap, Upstash Max Budget ve Google anahtar iptali panellerde tamamlandığında ve kalan P1/P2 Codex bulguları kapatıldığında canlıya hazırdır.)*
