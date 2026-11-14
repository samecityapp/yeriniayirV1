---
name: yeriniayir-gastronomy-v3
description: >-
  End-to-end V3.7 workflow for researching, curating, caching, compiling, testing, and publishing gastronomy regions and venues in Yerini Ayır (yeriniayir-cloud-admin). Use whenever the user asks to add a new neighborhood/district/city guide (e.g., "Galata, Beşiktaş, Bebek için yap"), audit or update an existing gastronomy region, add/remove/pin a specific venue, check Google Places API quota/costs, or deploy gastronomy updates to GitHub/Vercel.
---

# Yerini Ayır Gastronomi V3.7 İş Akışı Skill'i

Bu skill, `AGENTS.md` ve `lib/gastronomy-v3/RULES.md` içinde tanımlı 8 politika kapısını, saf kahveci/zincir engellerini, `≥ 4.4` puan standardını ve V3.7 Google Places API maliyet korumasını **sıfır sapmayla ve birebir çalışma sırasıyla** uygular.

- **Ön Koşul:** `AGENTS.md` kuralları istisnasız bağlayıcıdır. Tüm kabuk komutları `/Users/erdems/Documents/Codex/yeriniayir-cloud-admin` kökünde (`cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && ...`) çalıştırılır.
- **Yardımcı Referans:** Kod şablonu, 6 dosyalı entegrasyon kontrol listesi, tekil `placeId` ve `CHAIN_BLOCKLIST` ön tarama komutları için [architecture-and-checklist.md](./references/architecture-and-checklist.md) dosyasına bak.

---

## İş Akışı A: Yeni Bölge / Semt Ekleme (9 Zorunlu Adım)

### Adım 1 — Kota ve Coğrafi Sınır Ön Kontrolü
1. Mevcut aylık API kotasını ve önbellek durumunu kontrol et:
   ```bash
   cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && node scripts/discover_region_places.mjs --stats
   ```
2. `lib/gastronomy-v3/registry.ts` içinde yayındaki komşu bölgeleri ve `coming_soon` kuyruğunu kontrol et. Yeni bölgenin `bbox`, `excludeBbox` (varsa), `allowedNeighborhoodTokens`, `allowedDistricts` sınırlarını komşu/gelecek semtlerden (`Galata`, `Asmalımescit`, `Bebek` vb.) kesin çizgiyle ayır.
3. Bölgenin profilini belirle: standart `6` kategori, kıyı/Boğaz/sahil için `coastalSeafood: true` (`7` kategori), veya yöresel miras (`culinary_heritage`).

### Adım 2 — Web-First Yerel Araştırma (Ücretsiz)
Google Places `--reviews` harcamadan önce `search_web` ile semtin bağımsız uzman restoranlarını, kahvecilerini, pastane/kahvaltıcılarını ve tarihsel kurumlarını araştır:
- Her pozitif aday için **en az 2 bağımsız kaynak** (`operator`, `editorial`, `community`, `award`), gerçek birincil siparişler (`order`), birincille tekrar etmeyen kanıtlı en az 1 ikincil ürün (`sec`) ve dürüst `suitability` (`seat`, `crowd`, `dis`, `transit`) topla.
- Semtteki zincir/düşük puanlı/kalıcı kapalı/çikolatacı kahve hatası adaylarını da **negatif denetim kontrolü (`negControl`)** olarak not et.

### Adım 3 — Ortak Önbellekli Google Places Keşfi (`places-cache.json`)
1. Semti kapsayan aramaları tek seferlik script yazmadan `discover_region_places.mjs` ile çalıştır:
   ```bash
   cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && \
   node scripts/discover_region_places.mjs \
     --query="<Semt> pizza" --query="<Semt> specialty coffee" --query="<Semt> kahvaltı" \
     --center="LAT,LNG" --radius=1200 --max-fetches=20
   ```
2. Web araştırmasında çıkıp arama listesinde görünmeyen tekil mekanlar veya `negControl` adayları için `--ids="ChIJ...,ChIJ..."` ile tekil `GET` sorgusu yap (bu çağrı otomatik `places-cache.json` içine yazar).
3. `--reviews` bayrağını **kullanma** (yalnızca web'de hiç kanıtı bulunmayan en fazla `5` sınırda mekan için, son çare olarak kullanılabilir).
4. Seçilen tüm `placeId`'lerin yayındaki tüm diğer `lib/gastronomy-v3/regions/*.json` dosyalarıyla `0` çakışma verdiğini doğrula ([architecture-and-checklist.md](./references/architecture-and-checklist.md) içindeki tek satırlık `node -e` kontrolü).

### Adım 4 — `policy.ts` Ön Güncellemesi (Yeni Zincir / Tür Varsa)
- Araştırmada `CHAIN_BLOCKLIST` içinde henüz olmayan çok şubeli zincir/franchise tespit edildiyse önce mevcut tüm `regions/*.json` (`venues` + `nearbyVenues`) üzerinde **0 yanlış pozitif çakışma** testi çalıştır, ardından `lib/gastronomy-v3/policy.ts` (`CHAIN_BLOCKLIST` ve gerekiyorsa `FOOD_PLACE_TYPES`) içine ekle.

### Adım 5 — Bölge Tanım Dosyasını Yazma (`lib/gastronomy-v3/definitions/<regionKey>.ts`)
[architecture-and-checklist.md](./references/architecture-and-checklist.md) şablonunu kullanarak tanım dosyasını oluştur ve şu kuralları kontrol et:
- `area`: Daima `<Sokak veya Mikro-Mevki>, <Semt>` formatında (`Topağacı, Nişantaşı`).
- Koruma bayrakları (`flags`): `4.4` altına yalnızca `heritage`, `iconic`, `ritual` veya `userRef` varsa (ve `≥ 2` bağımsız kanıtla) in; `insider` bayrağı `4.4+` şartını gevşetmez.
- Ziyaretçi metinleri (`order`, `desc`, `sec[0..1]`, `seat`, `crowd`, `dis`, `transit`): Birinci şahıs, TL/saat, kaynak/ödül adı, `mükemmel*` veya `yorum*` alt-dizeleri kesinlikle bulunmamalı.
- Sayıyı tamamlamak için dolgu mekan ekleme; negatif kontrolleri `negControl(...)` olarak ekle.

### Adım 6 — Sıfır İstekli Çevrimdışı Derleme (`--max-fetches=0`)
1. `scripts/run_region_pipeline.mjs` içindeki `PUBLISHED_REGION_KEYS` dizisine `<regionKey>` anahtarını ekle.
2. Pipeline'ı **mutlaka** `--max-fetches=0` ile çalıştır:
   ```bash
   cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && \
   node scripts/run_region_pipeline.mjs --region=<regionKey> --max-fetches=0
   ```
3. Çıktıda `0 yeni istek`, tüm pozitif adayların `PASS`, tüm negatif kontrollerin beklenen nedenlerle `DROP` olduğunu ve Aşama 2 `nearbyVenues` güncellemesini kontrol et (komşu bir bölgenin `.json` dosyası da Aşama 2 nedeniyle güncellendiyse onu da commit listesine ekle).
4. Ziyaretçi metin hatası (`FORBIDDEN_VISITOR_COPY_REGEX` vb.) çıkarsa `definitions/<regionKey>.ts` içinde düzeltip `--max-fetches=0` ile yeniden çalıştır.

### Adım 7 — Runtime & UI Bağlantıları (4 Dosya)
1. `lib/gastronomy-v3/registry.ts`: Yeni `.json` snapshot'ını import et, `V3_ALL_PUBLISHED_SNAPSHOTS` dizisine ve `V3_PUBLISHED_SNAPSHOTS` alias haritasına ekle; varsa `V3_LOCATIONS` içindeki eski `coming_soon` kaydını sil.
2. `lib/food/realProvider.ts`: `getLocationBySlug` içinde tüm slug/semt alias'larını ekle.
3. `components/food/GastronomyPageClient.tsx`: `REGION_CURATED_CARDS` kartını ve hero özet bandını güncelle.
4. `components/food/LocationPickerModal.tsx`: GPS bulunamadı mesajına ve arama `placeholder` metnine yeni bölge(ler)i ekle.

### Adım 8 — Regresyon Testlerini Güncelleme & 4'lü Doğrulama
1. `scripts/verify_v3_gastronomy.cjs` içinde:
   - `REGION_KEYS` listesini, `isCoastal` kontrolünü (kıyıysa), toplam bölge sayısını (`N -> N+k`), `getReadyRegions` / `readIntegrationDiscovery` listelerini ve alias/unpublished kontrollerini güncelle.
   - Yeni `.audit.json` negatif kontrolleri, kategori sayıları, mekan adetleri, `<Semt>` konum etiketleri, kategori liderleri (`secondaryCategoryIds` varsa üst kategoriden gelen mekanın `coreVenues[0]` olacağını hesaba kat) ve V3.6 `bannedRe` kurallarını ekle.
2. Tam doğrulama kapısını çalıştır (tümü `exit 0` vermeli):
   ```bash
   cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && \
   node scripts/verify_v3_gastronomy.cjs && \
   node scripts/verify_visitor_content.cjs && \
   npx tsc --noEmit && \
   npm run build
   ```

### Adım 9 — Güvenli Git Commit, Push ve Vercel Preview
1. Yalnızca kapsam klasörlerini kontrol et (`git add .` veya `git add -A` **ASLA** çalıştırma):
   ```bash
   cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && \
   git status --short lib/ components/ scripts/ AGENTS.md .agents/
   ```
2. Yalnızca değişen görev dosyalarını açık yollarıyla `git add` ile ekle (`/work/` `.gitignore` içindedir, eklenmez), `git diff --cached --name-only` çıktısını doğrula, commit et ve `feat/antigravity-production-readiness` dalına push et (GitHub push sonrası Vercel preview otomatik yayınlanır).

---

## İş Akışı B: Mevcut Bölgeye Tekil Mekan Ekleme / Çıkarma / Sabitleme (Hızlı Yol)

Kullanıcı mevcut yayındaki bir bölgede tek bir mekanı eklemek, en üstte göstermek veya kalitesiz bir yeri çıkarmak istediğinde:
1. **Keşif:** Eklenecek mekanın `placeId`'sini `node scripts/discover_region_places.mjs --query="..."` veya `--ids="..."` ile önbelleğe al.
2. **Tanım Güncellemesi:** İlgili `lib/gastronomy-v3/definitions/<regionKey>.ts` dosyasını düzenle:
   - Kullanıcı özel olarak önerdiyse `flags: { userRef: true }`, en üstte isteniyorsa `pinnedFirst: true` (ör. `Boter Kalamış`) ve birden fazla sekme gerekiyorsa `secondaryCategoryIds` kullan.
   - Kötü bir mekan çıkarılıyorsa silmek yerine `negControl(...)` olarak denetim kaydına çevir ve zincir ise `policy.ts` (`CHAIN_BLOCKLIST`)'e ekle.
3. **Çevrimdışı Derleme & Yayın:** `node scripts/run_region_pipeline.mjs --region=<regionKey> --max-fetches=0` çalıştır, `scripts/verify_v3_gastronomy.cjs` beklentilerini güncelle, 4'lü doğrulamayı (`verify_v3_gastronomy` + `verify_visitor_content` + `tsc` + `build`) geçir ve açık dosya listesiyle commit/push yap.

---

## Sık Yapılan Hatalar

1. **Alt-Dize Metin Reddi:** Ziyaretçi alanlarında `mükemmelleştirme` veya `yorumlayan` yazmak — `FORBIDDEN_VISITOR_COPY_REGEX` kelime sınırı olmadan eşleştiği için pipeline hata verir.
2. **`secondaryCategoryIds` Liderlik Yanılgısı:** `pizza` kategorisindeki bir mekana `secondaryCategoryIds: ['date']` verip `verify_v3_gastronomy.cjs` içinde `date-mekanlari` `coreVenues[0]` için birincil `date` mekanını beklemek (`realProvider.ts` dizide önce gelen birincil kategoriyi korur).
3. **`git add .` Tuzağı veya Komşu `.json` Unutmak:** Repo kökünde takip edilmeyen dosyalar olduğu için `git add .` asla çalıştırılmaz; öte yandan Aşama 2 (`nearbyVenues`) komşu bir bölgenin `regions/*.json` dosyasını güncellediyse `git status --short lib/` ile görüp açık listeye eklemek gerekir.
