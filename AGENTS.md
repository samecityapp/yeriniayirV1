# AGENTS.md — Yerini Ayır (`samecityapp/yeriniayirV1`) Geliştirme, Güvenlik ve Gastronomi V3.7 Kuralları

Bu belge, Yerini Ayır projesinde çalışan tüm yapay zeka ajanları (Antigravity, Codex, vb.) için bağlayıcı kuralları ve değişmez standartları tanımlar. **Bu dosya “neye uyulacağını”, `.agents/skills/yeriniayir-gastronomy-v3/SKILL.md` ise “işin hangi sırayla yapılacağını” belirler.**

---

## 1. Proje Özeti, Çalışma Dizini ve Git Disiplini

- **Kanıtlanmış Repo Yolu:** `/Users/erdems/Documents/Codex/yeriniayir-cloud-admin` (`origin`: `samecityapp/yeriniayirV1`)
- **Aktif Geliştirme Dalı:** `feat/antigravity-production-readiness`
- **Teknoloji Yığını:** Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, Supabase (PostgreSQL + RLS), Upstash Redis (`@upstash/ratelimit`, `@upstash/redis`)
- **Domainler & i18n:** Türkçe `yeriniayir.com` (`/tr`), İngilizce `worldandhotels.com` (`/en`), yerel geliştirme ve Vercel Preview.
- **Dal ve Yayın Kuralı:**
  - `main` dalına doğrudan commit veya push yapılmaz. Çalışmalar `feat/...` veya `fix/...` dallarında yürütülür.
  - `feat/...` dalına `git push` yapıldığında Vercel preview derlemesi otomatik tetiklenir; canlı production domain geçişi ve canlı veritabanı migration'ı yalnız açık kullanıcı onayıyla yapılır.
- **Kritik Git Staging Kuralı (ASLA `git add .` YAPMA):**
  - Repo kökünde takip edilmeyen yerel dosyalar bulunduğundan **`git add .` veya `git add -A` kesinlikle çalıştırılmaz.**
  - Yalnızca görevde değiştirilen/oluşturulan dosyalar açık yollarıyla (`git add <dosya1> <dosya2>`) eklenir ve commit öncesi `git diff --cached --name-only` çıktısı doğrulanır.
  - `/work/` dizini (`work/gastronomy-v3/places-cache.json`, `*.audit.json`) `.gitignore` kapsamındadır; Git'e eklenmez.

---

## 2. Temel Güvenlik, Supabase & Mevcut Vitrin Koruması (ASLA İHLAL EDİLEMEZ)

1. **Sabit Şifre ve Yedek Yasağı:** `middleware.ts` ve test betikleri dahil hiçbir yerde `|| 'Otel2024!'` gibi sabit parola yedeği bırakılamaz. `ADMIN_PASSWORD` eksikse `/jilinrime` ve yönetici rotaları **Fail-Closed (`503 Service Unavailable`)** dönmelidir. Cloud admin yetkisi Supabase MFA (`aal2`) gerektirir.
2. **Supabase İstemci İzolasyonu (`lib/supabase-admin.ts`):** `SUPABASE_SERVICE_ROLE_KEY` yalnız sunucu tarafında kullanılır (`typeof window !== 'undefined'` koruması korunur), **asla client bileşenlere import edilemez** ve anahtar/ön ek loglanamaz.
3. **Canlı Supabase & Sır Koruması:** Kullanıcı açık onayı olmadan canlı Supabase üzerinde `ALTER TABLE`, `DROP POLICY`, RLS gevşetmesi veya `restaurants` tablosuna yeni kayıt eklemesi yapılamaz; bölge seçkileri snapshot/dossier dosyalarında tutulur. `.env` ve `.env.local` asla Git'e eklenmez.
4. **Mevcut Vitrin & Bağımlılık Koruması:** `components/nearby-places/RestaurantCard.tsx`, `PremiumRestaurantCard.tsx` ve ana sayfa vitrin kart tasarımları kullanıcı onayı olmadan değiştirilemez; `node_modules` üzerinden bağımlılık değiştirilemez.

---

## 3. Gastronomi V3.7 Seçim Anayasası — 8 Zorunlu Politika Kapısı (`lib/gastronomy-v3/policy.ts`)

Yeni bölge eklenirken veya mevcut bölge güncellenirken istisnasız aşağıdaki 8 kapı uygulanır:

1. **Kapı 1 — Operasyonel Durum:** Yalnızca canlı Google Places `businessStatus === 'OPERATIONAL'` olan mekanlar kabul edilir (`CLOSED_PERMANENTLY`, `CLOSED_TEMPORARILY` reddedilir).
2. **Kapı 2 — Sıfır Zincir, Franchise ve Hazır Yemek Şubesi (`CHAIN_BLOCKLIST`):**
   - Çok şubeli kahve, fast-food, hazır ev yemeği, börek/tatlı ve AVM brasserie zincirleri kesinlikle sisteme giremez: `Pizza V`, `Kaffee Schütz`, `Adile Sultan Ev Yemekleri`, `Çanak Kebap`, `Espressolab`, `Starbucks`, `Coffy`, `Kahve Dünyası`, `Arabica`, `Viyana Kahvesi`, `Kronotrop`, `Coffee Manifesto`, `Nevada Coffee`, `The Co. Coffee`, `Cro & Cups`, `Beyaz Fırın`, `Vakko`, `Divan`, `BigChefs`, `Midpoint`, `Happy Moon's`, `Cookshop`, `The House Cafe`, `5Masa`, `Simple Co`, `Flân`, `Develi`, `Bedri Usta`, `Günaydın Kebap`, `Perran Ocakbaşı`, `Saltbae`, `White Burger`, `Biber Burger`, `Balta Burger`, `Brand Burger`, `Butcher's Burger`, `Perlo's`, `Burgerlab`, `Domino's`, `Papa John's`, `Pizzabulls`, `PizzaLazza`, `Bafetto`, `Pizza Locale`, `Nappo`, `Faruk Güllüoğlu`, `Hafız Mustafa`, `Emirgan Sütiş`, `Çengelköy Börekçisi`, `Filizler Köftecisi`, `Kirpi`, `İntiba Döner`, `Döner Bank`, `Nazar Profiterol`, `Beylerbeyi Profiterol`, `La Veria` vb.
   - Yeni bölgede karşılaşılan çok şubeli/kalitesiz zincirler `CHAIN_BLOCKLIST` listesine eklenmeden önce mevcut tüm `regions/*.json` snapshot'larında yanlış pozitif çakışma (`0` çakışma) olmadığı doğrulanır.
3. **Kapı 3 & 3B — Yeme-İçme Türü & Saf Kahveci Kuralı:**
   - `FOOD_PLACE_TYPES` dışındaki işletmeler elenir (istisna: ana türü `book_store` olup adında `Cafe/Kafe/Kahve` geçen köklü kitabevi-kafeler).
   - **`kahve` kategorisi (birincil veya ikincil) %100 saf kahve uzmanlarına ayrılmıştır:** `primaryType` değeri `chocolate_shop`, `dessert_shop`, `dessert_restaurant`, `ice_cream_shop`, `candy_store`, `confectionery`, `pastry_shop`, `bakery` olan veya adında `çikolata / chocolat / tatlıcısı / pastanesi / unlu mamülleri` geçen yerler (`Hane Çikolata`, `Factory Karaköy`, `Homevibe` vb.) `kahve` kategorisine kesinlikle giremez.
4. **Kapı 4 — Kesin Lokalizasyon (`İl > İlçe > Semt`) & Tekil `placeId`:**
   - Her bölge sıkı coğrafi sınır (`bbox`, gerekirse `excludeBbox`), `allowedNeighborhoodTokens` ve `district` (`allowedDistricts`) ile tanımlanır.
   - Komşu semt/ilçe taşmaları (Galata/Asmalımescit -> Karaköy/Cihangir, Beşiktaş -> Nişantaşı, Erenköy -> Caddebostan, Osmanağa -> Moda) yasaktır. `Galata`, `Asmalımescit`, `Bebek` gibi ayrı tanımlı gelecek bölgeler kendi sınırlarında `coming_soon` tutulur.
   - Her mekanın kart konumu (`area` / `neighborhoodLabelOverride`) **`<Sokak veya Mikro-Mevki>, <Semt>`** biçiminde yazılır (ör. `Kemankeş Cd., Karaköy`, `Topağacı, Nişantaşı`).
   - Tüm yayındaki bölgeler arasında **sıfır `placeId` çakışması** zorunludur.
5. **Kapı 5 & 5B — Son Dönem Kalite Bozulması & Marka Sürekliliği:** Kalite/porsiyon bozulması bilinen mekanlar (`degradationFlag`) ile isim/el değiştirip eski kimliğini yitirenler (`expectedBrandWord`, ör. *Çekirdek* -> *Çekirdekhane*) reddedilir.
6. **Kapı 6 — Sıkı `≥ 4.4` Puan Tabanı & Sıfır Dolgu Kuralı:**
   - Standart kabul eşiği **`★4.4` puan ve `≥ 35` değerlendirme**dir. İlla 3–4 mekan önermek zorunlu değildir; nitelikli aday `1` taneyse `1` mekan çıkar, hiç yoksa kategori otomatik gizlenir (`Yoksa Gösterme`).
   - `4.4` altına yalnız gerçek tarihsel/ikonik istisna bayrağı ve **en az `2` bağımsız kanıt (`editorial` / `community` / `award`)** şartıyla inilir:
     - `flags.iconic` (`iconicSettingOrVibeProtected`): Deniz manzarası/tarihi mekân/semt atmosferi simgelerinde `★4.1+`, `≥ 200` değerlendirme (kategoride `5.` kontenjanı açar).
     - `flags.heritage` + `flags.ritual` ve `≥ 2.000` değerlendirme: Yarım asrı aşan yüksek sirkülasyonlu kurumlarda (`Kanaat 1933`, `Tatbak 1960` vb.) dezavantajları açık yazılmak şartıyla `★3.7+`.
     - `flags.heritage` (`chefOrHeritageProtected`): Tescilli şef mutfağı ve köklü tarihî kurumlarda (`Neolokal`, `Hünkar 1950`, `Savoy 1950` vb.) `★4.0+`, `≥ 200` değerlendirme.
     - `flags.ritual` (`localRitualProtected`): Köklü mahalle ritüellerinde `★3.8+`, `≥ 300` değerlendirme.
     - `flags.insider` (`communityInsiderProtected`): Yerel müdavim mekanlarında da **`★4.4+`** ve `≥ 60` değerlendirme zorunludur (`4.4` altını kurtarmaz).
     - `flags.userRef` (`userReferenceProtected`): Kullanıcının doğrudan referans gösterdiği özel mekanlarda `★3.8+` (`pinnedFirst: true` ile kategori başında sabitlenebilir, ör. `Boter Kalamış`).
7. **Kapı 7 — Aşırı Ticarileşmiş Turist Hacmi Filtresi:** Koruma bayrağı olmadan `> 5.000` değerlendirme ve `< 4.5` puana sahip noktalar reddedilir.
8. **Kapı 8 — Çoklu Kanıt, Şişirilmiş Puan Koruması & Dossier Tamlığı:**
   - `< 150` değerlendirmede `★4.8+` puan varsa en az `2` bağımsız `editorial`/`community`/`award` kanıtı zorunludur (`suspected_rating_inflation_no_community_proof`).
   - Her mekan için `≥ 2` kaynak, `whatToOrder`, birincille tekrar etmeyen kanıtlı en az `1` ikincil ürün (`secondaryItems` -> `alsoTry`), `suitability` (`seating`, `crowdAndNoise`, `disadvantage`, `transit`; `dineIn === false` ise `al-götür/ayakta` ibaresi zorunlu) ve iç `dossier` (`pros`, `cons`, `uncertainties`) eksiksiz olmalıdır. Bileşik skor `≥ 65` (`m=80, C=4.40`) şarttır.

---

## 4. Kategori Mimarisi, `secondaryCategoryIds` & `nearbyVenues`

- **Standart Kanonik Sıra (6 Kategori):** `1. pizza`, `2. hamburger`, `3. kahve`, `4. date` (`date-mekanlari`), `5. kahvalti`, `6. denemelisin`.
- **Konuma Özgü İstisnalar:** Kıyı/Boğaz/sahil semtlerinde (`coastalSeafood: true`) `7. balik` (`balik-deniz-urunleri — 🐟 Balıkçılar`) eklenir. Yöresel kimlikli şehirlerde (ör. Gaziantep `culinary_heritage`, Antalya `kofte-piyaz` / `ates-firin`) yerel mutfak kategorileri kullanılır.
- **Tavanlar & Dolgu Yasağı:** Standart kategoriler `1..4` (`iconic` koruması varsa `5`), `denemelisin` dinamik `1..10`; nitelikli aday yoksa sayıya tamamlamak için vasat mekan konmaz.
- **`secondaryCategoryIds` Sıralama Kuralı:** `lib/food/realProvider.ts` `data.venues` dizisinin kanonik sırasını koruduğu için üst sıradaki bir kategoride (ör. `pizza`) `secondaryCategoryIds: ['date']` alan mekan, `Date Mekanları` sekmesinde birincil `date` mekanlarının önünde yer alır; ikincil etiket yalnız o sekmenin vitrinine yakışan yerlere verilir.
- **`nearbyVenues`:** Semt sınırından (`bbox \ excludeBbox`) en fazla **`<= 400 metre`** mesafede ve kategori başına en fazla **`1`** (`0` veya `1`) doğrulanmış yakın öneri hesaplanır; kuş uçuşu yürüyüş süresi uydurulmaz.

---

## 5. Ziyaretçi Metin İzolasyonu & Yasaklı İfadeler (`validateVisitorCopy`)

- Ziyaretçi snapshot'larında (`lib/gastronomy-v3/regions/*.json`) ve ön yüz bileşenlerinde **asla** `userRatingCount`, kaynak URL'si, yayın/ödül adı (`Michelin`, `Gault`, `Time Out`, `Barista Magazine`) veya `Google Places / API fiyat` ifadeleri bulunamaz; ön yüz asla `lib/gastronomy-v3/dossiers/` import etmez.
- Birinci şahıs tadım iddiaları (`tattım`, `denedim`, `gittim`, `bayıldım`, `favorimiz`) ile doğrulanmamış TL fiyatları (`250 TL`, `₺`) ve saatler (`09:00`, `22:30`) yasaktır. Bütçe seviyesi yalnız API `priceLevel` varsa gösterilir.
- **Alt-dize (Substring) Tuzağı:** `FORBIDDEN_VISITOR_COPY_REGEX` kelime sınırı olmadan `/en iyi|rakipsiz|kusursuz|mükemmel|muhteşem|tartışmasız|1 numara|yorum/i` kontrolü yapar; bu yüzden ziyaretçi alanlarında **`mükemmelleştirme`**, **`yorumlayan`**, **`yorumu`** gibi alt-dize içeren kelimeler de kullanılamaz.
- Her harita linki `https://maps.google.com/?cid=...` formatında olmalıdır.

---

## 6. Google Places API Maliyet Koruması (V3.7 Sıfır Sürpriz Fatura Kuralı)

- Yalnızca **`ENTERPRISE_FIELD_MASK`** alanları istenir (`id,displayName,formattedAddress,rating,userRatingCount,businessStatus,primaryType,types,googleMapsUri,priceLevel,websiteUri,location,addressComponents`).
- **Atmosphere SKU Yasağı:** `reviews`, `dineIn`, `takeout`, `outdoorSeating`, `reservable`, `editorialSummary`, `currentOpeningHours`, `regularOpeningHours` alanları pipeline ve keşif maskelerine kesinlikle eklenmez (`Atmosphere` aylık sayacı `0/1000` tutulur; ücretsiz aylık kota `1.000 Place Details Enterprise` + `1.000 Text Search Enterprise`).
- Keşif daima ortak `work/gastronomy-v3/places-cache.json` önbelleğini kullanan `scripts/discover_region_places.mjs` ile yapılır; `--reviews` yalnızca web araştırmasında hiç kanıt çıkmayan en fazla `5` sınırda mekan için kullanılır.
- `scripts/run_region_pipeline.mjs` daima **`--max-fetches=0`** ile çalıştırılır; toplu `--all --refresh` çalıştırmak yasaktır.

---

## 7. Zorunlu Doğrulama ve Yayın Kapısı

Her değişiklikten sonra şu 4 kontrol `exit 0` vermeden commit/push yapılmaz (RLS/DB değişikliğinde ek olarak `node scripts/verify_rls_security.mjs`):

```bash
node scripts/verify_v3_gastronomy.cjs && \
node scripts/verify_visitor_content.cjs && \
npx tsc --noEmit && \
npm run build
```
