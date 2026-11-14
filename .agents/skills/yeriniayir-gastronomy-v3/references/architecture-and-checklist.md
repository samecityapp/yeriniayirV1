# Yerini Ayır Gastronomi V3.7 — Teknik Referans ve Kontrol Listesi

Bu doküman [.agents/skills/yeriniayir-gastronomy-v3/SKILL.md](../SKILL.md) iş akışının teknik referansıdır.

---

## 1. Bölge Tanım Dosyası Şablonu (`lib/gastronomy-v3/definitions/<regionKey>.ts`)

```ts
import { buildRegionCategories } from '../categories';
import { compactSeed, negControl } from '../compactSeed';
import type { V3RegionDefinition } from '../types';

export const REGION_DEF: V3RegionDefinition = {
  id: 'galata-beyoglu', // registry / FoodLocation.id
  slug: 'galata',
  city: 'İstanbul',
  district: 'Beyoğlu',
  // Birden fazla belediye sınırı paylaşan bölgelerde (ör. Koşuyolu & Acıbadem):
  // allowedDistricts: ['Kadıköy', 'Üsküdar'],
  neighborhood: 'Galata',
  officialQuarter: 'Bereketzade',
  displayName: 'Galata, Beyoğlu, İstanbul',
  locative: "Galata'da",
  path: ['istanbul', 'beyoglu', 'galata'],
  aliases: ['Galata', 'Bereketzade', 'Şahkulu', 'Beyoğlu'],
  scopeNote: 'İstanbul · Beyoğlu · Galata (Yalnızca doğrulanmış semt sınırları)',
  characterSubtitle:
    'Semtin gastronomi karakterini özetleyen kısa nesnel alt başlık',
  center: { lat: 41.0256, lng: 28.9742 },
  bbox: { minLat: 41.022, maxLat: 41.030, minLng: 28.970, maxLng: 28.979 },
  // Komşu semti oymak gerekiyorsa:
  // excludeBbox: { minLat: ..., maxLat: ..., minLng: ..., maxLng: ... },
  allowedNeighborhoodTokens: ['Bereketzade', 'Şahkulu', 'Müeyyedzade', 'Galata'],
  categories: buildRegionCategories({
    // Boğaz/kıyı/sahil semti ise `🐟 Balıkçılar` 7. sekmesi için:
    // coastalSeafood: true,
  }),
  candidates: [
    compactSeed({
      id: 'gal-ornek-pizza',
      placeId: 'ChIJ...', // Mutlaka discover_region_places.mjs ile places-cache.json'da olmalı
      cat: 'pizza',
      // İsteğe bağlı ikincil sekme (DİKKAT: kanonik üst kategori sekmede öne geçer):
      // secondaryCategoryIds: ['date'],
      // Kullanıcı doğrudan en üstte istediyse:
      // pinnedFirst: true,
      brand: 'ornek',
      area: 'Büyük Hendek Cd., Galata', // Daima "<Sokak/Mevki>, <Semt>" formatı
      signals: ['ekşi-maya-hamur', 'tas-firin'],
      // İsteğe bağlı koruma bayrakları:
      // flags: { iconic: true, heritage: true, insider: true, ritual: true, userRef: true },
      desc:
        'Büyük Hendek Caddesi’nde uzun fermantasyon hamuru taş fırında pişiren bağımsız pizza adresi.',
      order: ['Margherita', 'Burrata Pizza'],
      menu: ['Marinara', 'Diavola'],
      sec: [
        ['Ev Yapımı Tiramisu', 'Yemek sonrası tekil porsiyon tatlı servisi.', 'İşletme menüsü + yerel seçki'],
      ],
      seat: 'İçeride sınırlı masa ve sokak önü oturumu',
      crowd: 'Akşam saatlerinde yoğun semt sirkülasyonu',
      dis: 'Küçük alan nedeniyle yoğun saatlerde kapıda bekleme oluşabilir',
      transit: 'Şişhane metro çıkışından yürüyüş mesafesi',
      sources: [
        ['Resmi Instagram / Menü', 'https://example.com/menu', 'operator', 'Güncel pizza ve tiramisu menüsü'],
        ['Editöryal / Yerel Seçki', 'https://example.com/guide', 'editorial', 'Hamur fermentasyonu ve taş fırın doğrulaması'],
      ],
      pros: ['Tek şubeli uzman üretim', 'Yüksek puan istikrarı'],
      cons: ['Küçük salonda akşam yoğunluğu'],
      unc: ['Hafta sonu masa bekleme süresi yoğunluğa göre değişebilir'],
    }),

    // Negatif Denetim Kontrolleri (.audit.json + verify_v3_gastronomy.cjs tarafından doğrulanır)
    negControl(
      'ctrl-gal-espressolab-chain',
      'ChIJ...',
      'kahve',
      'Çok şubeli kahve zinciri (Kapı 2)'
    ),
  ],
};
```

### Koruma Bayrakları Matrisi (`lib/gastronomy-v3/policy.ts`)

| Bayrak (`compactSeed` -> `flags`) | Politika Alanı | Min. Puan | Min. Yorum | Bağımsız Kanıt | Ek Etki |
| :--- | :--- | :--- | :--- | :--- | :--- |
| *(Bayrak yok — standart)* | — | `★4.4` | `35` | `≥ 2` (tür dahil) | Standart eşik |
| `insider: true` | `communityInsiderProtected` | **`★4.4`** | `60` | `≥ 2` (`editorial`/`community`/`award`) | `4.4` altını kurtarmaz; `+12` bonus |
| `iconic: true` | `iconicSettingOrVibeProtected` | `★4.1` | `200` | `≥ 2` (`editorial`/`community`/`award`) | Kategoride **5. kontenjan** açar (`+15` bonus) |
| `heritage: true` | `chefOrHeritageProtected` | `★4.0` | `200` | `≥ 2` (`editorial`/`community`/`award`) | Şef/köklü miras koruması (`+12` bonus) |
| `ritual: true` | `localRitualProtected` | `★3.8` | `300` | `≥ 2` (`editorial`/`community`/`award`) | Ritüel/bütçe dostu durak (`+4/+6` sirkülasyon + `+12`) |
| `heritage: true` + `ritual: true` | Yüksek sirkülasyon kurumu | `★3.7` | `2.000` | `≥ 2` (`editorial`/`community`/`award`) | Yarım asırlık kurum (dezavantaj açık yazılır) |
| `userRef: true` | `userReferenceProtected` | `★3.8` | `35+` | `≥ 2` (`editorial`/`community`/`award`) | Doğrudan kullanıcı talebi (`+12`, `pinnedFirst` ile) |

> `< 150` değerlendirmede `★4.8+` puan için en az `2` bağımsız `editorial` / `community` / `award` kanıtı zorunludur. Koruma bayrağı olmadan `> 5.000` değerlendirme + `< 4.5` puanlı yerler reddedilir.

---

## 2. Güvenli Ön Kontroller (Tek Komut)

### `CHAIN_BLOCKLIST` Eklemesi Öncesi Sıfır Çakışma Testi
Yeni zincir kelimesi eklemeden önce yayındaki 21+ bölgede hiçbir meşru mekanı vurmadığını doğrula:

```bash
cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && node -e "
const fs = require('fs');
const tokens = ['yeni zincir 1', 'yeni zincir 2'];
const norm = (s) => s.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
const hits = [];
for (const file of fs.readdirSync('lib/gastronomy-v3/regions')) {
  const s = JSON.parse(fs.readFileSync('lib/gastronomy-v3/regions/' + file, 'utf8'));
  for (const v of [...s.venues, ...(s.nearbyVenues || [])]) {
    const n = norm(v.name);
    for (const t of tokens) if (n.includes(norm(t))) hits.push({ file, venue: v.name, token: t });
  }
}
console.log(hits.length ? hits : 'ZERO_COLLISIONS_VERIFIED');
"
```

### Tüm Yayındaki Bölgelerle Tekil `placeId` Kontrolü
```bash
cd /Users/erdems/Documents/Codex/yeriniayir-cloud-admin && node -e "
const fs = require('fs');
const seen = new Map();
for (const f of fs.readdirSync('lib/gastronomy-v3/regions').filter(x => x.endsWith('.json') && !x.includes('nearby-pool'))) {
  const s = JSON.parse(fs.readFileSync('lib/gastronomy-v3/regions/' + f, 'utf8'));
  for (const v of s.venues) {
    if (seen.has(v.placeId)) console.error('OVERLAP:', v.placeId, seen.get(v.placeId), f);
    seen.set(v.placeId, f);
  }
}
console.log('Checked unique placeIds:', seen.size);
"
```

---

## 3. 6 Dosyalı Entegrasyon Kontrol Listesi

1. [scripts/run_region_pipeline.mjs](../../../../scripts/run_region_pipeline.mjs): `PUBLISHED_REGION_KEYS` dizisine ekle, `--region=<key> --max-fetches=0` ile derle.
2. [lib/gastronomy-v3/registry.ts](../../../../lib/gastronomy-v3/registry.ts): Snapshot JSON import et → `V3_ALL_PUBLISHED_SNAPSHOTS` dizisine ekle → `V3_PUBLISHED_SNAPSHOTS` alias'larını ekle → `V3_LOCATIONS` içindeki varsa eski `coming_soon` kaydını kaldır.
3. [lib/food/realProvider.ts](../../../../lib/food/realProvider.ts): `getLocationBySlug` alias koşullarını ekle.
4. [components/food/GastronomyPageClient.tsx](../../../../components/food/GastronomyPageClient.tsx): `REGION_CURATED_CARDS` kartını ve hero özet satırını güncelle.
5. [components/food/LocationPickerModal.tsx](../../../../components/food/LocationPickerModal.tsx): GPS bulunamadı mesajını ve arama kutusu `placeholder` metnini güncelle.
6. [scripts/verify_v3_gastronomy.cjs](../../../../scripts/verify_v3_gastronomy.cjs): `REGION_KEYS`, `isCoastal`, bölge sayısı, `getReadyRegions`, `readIntegrationDiscovery`, `.audit.json` negatif kontrolleri, kategori liderleri, `<Semt>` konum formatı ve V3.6 `bannedRe` ekle.

---

## 4. Güncel Bölge Durumu (Kasım 2026 — 21 Yayında + 5 Sırada)

- **Yayındaki Bölgeler (21):**
  `istanbul-kadikoy-moda`, `istanbul-kadikoy-carsi`, `istanbul-kadikoy-yeldegirmeni`, `istanbul-kadikoy-feneryolu`, `istanbul-kadikoy-fenerbahce-kalamis`, `istanbul-kadikoy-caddebostan`, `istanbul-kadikoy-suadiye`, `istanbul-kadikoy-bostanci`, `istanbul-kadikoy-kosuyolu-acibadem`, `istanbul-uskudar-merkez`, `istanbul-uskudar-kuzguncuk`, `istanbul-uskudar-cengelkoy`, `istanbul-beyoglu-karakoy`, `istanbul-beyoglu-cihangir`, `istanbul-sisli-nisantasi`, `aydin-kusadasi`, `gaziantep-merkez`, `antalya-kaleici`, `antalya-lara`, `antalya-konyaalti`, `mugla-ula-akyaka`.
- **Sonraki Doğrulama Kuyruğu (`coming_soon` — 5):**
  `galata-beyoglu` (`galata`), `asmalimescit-beyoglu` (`asmalimescit`), `bebek-besiktas` (`bebek`), `yalikavak-bodrum-mugla` (`yalikavak`), `bitez-bodrum-mugla` (`bitez`).
