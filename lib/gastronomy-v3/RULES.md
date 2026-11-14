# Gastronomi V3.5 Seçim Algoritması ve Kategori Kuralları (`RULES.md`)

Bu doküman `lib/gastronomy-v3` motorunun kalıcı anayasasıdır. Tüm şehir, ilçe ve semt güncellemelerinde istisnasız uygulanır.

---

## 1. Kesin Lokalizasyon (`İl > İlçe > Semt`) & Yakındaki Diğer Öneriler
- Her bölge sıkı coğrafi sınır (`bbox`, gerekirse `excludeBbox` ve `allowedNeighborhoodTokens`) ile tanımlanır.
- Komşu semt veya ilçe taşmaları (ör. Erenköy mekanlarının Caddebostan'a, Osmanağa mekanlarının Moda'ya dahil edilmesi) kabul edilmez.
- Google Places canlı koordinatı ve adres bileşenleri semt sınırını doğrulamıyorsa aday otomatik reddedilir.
- **Her Konum ve Her Kategori İçin Çok Yakın Tekil Öneri (`nearbyVenues`):** Seçili semtin kendi sınırları (`coreVenues`) %100 saf tutulurken, hemen altında komşu sınırdaki doğrulanmış alternatif gösterilir.
  - **Sınırdan Mesafe Ölçümü:** Mesafe semtin merkezinden değil, doğrudan **seçili semtin coğrafi sınırından (`bbox \ excludeBbox`)** metre cinsinden ölçülür.
  - **Maksimum 400 Metre Kuralı:** Yalnızca semt sınırının hemen dışında **en fazla `400 metre` (`<= 400 m`)** mesafedeki doğrulanmış adaylar değerlendirilir; `1 km` ve üzeri uzaklıktaki mekanlar kesinlikle önerilmez.
  - **Kategori Başına En Fazla 1 Öneri (`0` veya `1`):** Her kategoride en fazla `1` yakın öneri gösterilir (2 bile olamaz). `400 metre` sınırında uygun doğrulanmış mekan yoksa o kategori için yakın öneri gösterilmez (`0`, dolgu yasak).

## 2. Standart 6 Kategori + Konuma Özgü İstisnalar
- Şehir içi ve kıyı/turistik bölgelerde (`profile: 'standard_urban_or_coastal'`) kanonik kategori sırası sabittir:
  1. `pizza` — Pizza
  2. `hamburger` — Hamburger
  3. `kahve` — Kahve
  4. `date-mekanlari` — Date
  5. `kahvalti` — Kahvaltı
  6. `denemelisin` — O Bölgeye Özgü Şeyler Denemelisin
- Ege sahil ve yazlık kıyı bölgelerinde (`coastalSeafood: true`, ör. Kuşadası) standart 6 kategoriye ek olarak **`7. balik-deniz-urunleri — 🐟 Balıkçılar`** kategorisi açılır; böylece gerçek sahil balıkçıları hem ayrı sekmede keşfedilir hem `Date` ve `Denemelisin` sekmelerini boğmaz.
- Gaziantep gibi doğrudan yerel mutfak kimliğiyle anılan özel konumlarda (`profile: 'culinary_heritage'`) standart pizza/hamburger şablonu zorlanmaz; bölgenin en köklü yöresel yemek kategorileri kullanılır.
- Afyonkarahisar (lokum vb.) gibi konuma özgü belirgin bir imza ürün başlığı varsa `extraCategories` ile eklenir.

## 3. Kategori Başına Mekan Sayısı, İkonik 5. Slot & Dinamik `denemelisin` (`1..10`, Dolgu Yasak)
- Standart kategorilerde (`pizza`, `hamburger`, `kahve`, `date-mekanlari`, `kahvalti`) temel tavan `maxPerCategory = 4` mekandır; sayıyı 4'e tamamlamak için zincir işletme, vasat alternatif veya düşük kaliteli dolgu mekan eklenmez (`1..4`, nitelikli aday yoksa kategori dinamik olarak gizlenir, ör. Caddebostan Kahvaltı).
- **İkonik Konum / Manzara / Atmosfer 5. Slot Koruması (`iconicSettingOrVibeProtected`):** Deniz manzarası, tarihi köşk/iskele konumu veya benzersiz semt atmosferi/müdavim kitlesiyle o semtin kimliğini temsil eden ama sirkülasyon nedeniyle Google puanı `4.1–4.3` bandında kalan mekanlar (`>= 200` değerlendirme ve `>= 2` bağımsız kaynak şartıyla) elenmez; standart kategoride 5. kontenjanı açarak (`max = 5`) listeye girer. Konum/manzara bilgisi %100 gerçek olmak zorundadır (ör. Şifa Sk. deniz manzaralı tarihi köşk `Rawsters Moda` ile Bademaltı Sk. ikonik iç mekan kavurmahane `Walter's Coffee Roastery` ayrımı gerçeğe birebir sadık yazılır).
- **`denemelisin` ("O Bölgeye Özgü Şeyler Denemelisin") `1..10` Dinamik Tavan:** Semtin gerçek özgün deneyim sayısına göre `1` ile `10` arasında dinamik sayıda mekan alır. Özel yer 2 taneyse 2, 4 taneyse 4, 7-8 taneyse 7-8, 10 taneyse 10 çıkar; sayıyı 10'a tamamlamak için asla sıradan/dolgu mekan eklenmez.

## 4. Çoklu Kaynak Uzlaşısı, Marka Sürekliliği & Anti-Manipülasyon
- **Tek başına Google puanıyla seçim yasaktır:** Her mekan için işletme menüsü/sitesi (`operator`), editoryal gastronomi yayınları (`editorial`), yerel topluluk forumları/müdavim paylaşımları (`community`) veya gastronomi ödülleri (`award`) arasından **en az 2 bağımsız kanıt** zorunludur.
- **Zincir bloğu:** `CHAIN_BLOCKLIST` kapsamındaki endüstriyel/yaygın zincirler her koşulda reddedilir (`Emirgan Sütiş`, `Doyuyo`, `Coffy`, `Starbucks` vb. dahil).
- **Hibrit kitabevi-kafe doğrulaması:** Google Places ana türü `book_store` görünse bile resmi işletme adında `Cafe/Kafe/Kahve` geçen köklü mekanlar (ör. *Nail Kitabevi & Cafe*) yeme-içme mekanı olarak değerlendirilir.
- **Marka sürekliliği (`expectedBrandWord`):** İsim değiştirmiş, el değiştirmiş veya eski kimliğini kaybetmiş işletmeler (ör. eski *Çekirdek* yerine açılan *Çekirdekhane*) `brand_discontinuity` ile reddedilir.
- **Yerel müdavim / şef / miras / ikonik konum koruması:**
  - `iconicSettingOrVibeProtected` işaretli, en az `200` değerlendirmeye ve `2+` bağımsız editoryal/topluluk/ödül kaynağına sahip semt simgesi mekanlarda `4.1+` puan kabul edilir.
  - Hem `chefOrHeritageProtected` hem `localRitualProtected` işaretli yarım asrı aşan yüksek sirkülasyonlu amiral yerel kurumlarda (ör. 1933 *Kanaat Lokantası*), en az `2.000` değerlendirme ve `2+` bağımsız kaynakla ve ödeme/fiyat/kalabalık dezavantajlarının açıkça yazılması şartıyla `3.7+` puan kabul edilir.
  - `chefOrHeritageProtected` işaretli tarihi/dünya çapında tescilli yerel kurumlarda (ör. Çiya Sofrası, Yanyalı Fehmi Lokantası, Halil Lahmacun) en az `200` değerlendirme ve `2+` bağımsız kaynakla `4.0+` puan kabul edilir.
  - `localRitualProtected` işaretli yerel halk ritüeli / bütçe dostu müdavim duraklarında (ör. Çardak 6, Tuki Çarşaflı, Ada Söğüşçüsü, Bülbül Restaurant) hızlı sokak/hafta sonu servisi veya kurye yorumları nedeniyle puan `3.8–4.3` bandında kalsa bile en az `300` değerlendirme ve `2+` bağımsız editoryal/topluluk kanıtıyla koruma altına alınır (`ritualCirculationBonus` uygulanır).
  - `communityInsiderProtected` işaretli yerel müdavim mekanlarında en az `60` değerlendirme ve `2+` bağımsız kaynakla `4.2+` puan kabul edilir.
- **Sahte/şişirilmiş puan koruması:** Değerlendirme sayısı `150` altında olup `4.8+` puana sahip mekanlarda en az `2` bağımsız `editorial`, `community` veya `award` kanıtı bulunmuyorsa `suspected_rating_inflation_no_community_proof` ile reddedilir.
- **Bayesçi güven & hacim istikrarı dengesi:** Ham Google puanı tek başına kullanılmaz; düşük değerlendirme sayılarındaki oynaklığı dengelemek için Bayesçi güven düzeltmesi (`m=80, C=4.40`) uygulanır ve `700+` / `1500+` değerlendirmede `4.5+` istikrarını koruyan köklü mekanlara sürdürülebilir hacim puanı verilir.

## 5. Ana Uzmanlık + Kanıtlı İkincil Ürün (`secondaryItems` -> `alsoTry`)
- Her mekanda birincil imza ürünlerinin (`whatToOrder`) dışında kalan, kaynaklarda açıkça öne çıkan en az 1 ikincil ürün ("Ayrıca Bunları da Dene", ör. kahvecinin sandviçi, burgercinin taco/milkshake'i, pizzacının tiramisusu, dönercinin fırın sütlacı) doğrulanmış olmalıdır.
- İkincil ürünler `whatToOrder` listesiyle tekrar edemez ve mutlaka bir kaynak referansına (`proof`) bağlanır.

## 6. Kullanıcı Uygunluğu, Dürüst Dezavantaj & Sıfır Halüsinasyon
- Her mekanın pratik seçim kartında (`suitability` -> `beforeYouGo`) şu 4 alan net sunulur:
  1. Oturma ve servis düzeni (`seating` — canlı Google Places `dineIn`/`takeout` verisiyle çelişemez),
  2. Gerçekçi dezavantaj / yoğunluk / sıra / gürültü notu (`disadvantage`),
  3. Ulaşım ve yürüyüş ekseni (`transit`),
  4. Doğrulanmış bütçe seviyesi (`priceLevel` yalnızca Google Places API'de mevcutsa gösterilir; yoksa varsayım yapılmaz).
- Doğrulanmayan TL fiyatı, açılış-kapanış saati, vegan/glütensiz diyet veya engelli erişimi iddiası kesinlikle yazılmaz.

## 7. Kalıcı Seçim Gerekçesi (`dossiers/*.dossier.json`) & Ziyaretçi İzolasyonu
- Her bölgenin tam seçim dosyası (önerilen birincil/ikincil ürünler, kaynak URL'leri, doğrulama tarihleri, Google `placeId`, koordinat, güçlü/zayıf yanlar ve belirsizlikler) `lib/gastronomy-v3/dossiers/<region>.dossier.json` ve `work/gastronomy-v3/<region>.audit.json` altında saklanır.
- Kaynak mecra adları, URL'ler ve ham Google yorum sayıları ziyaretçi snapshot dosyalarına (`lib/gastronomy-v3/regions/*.json`) ve ön yüz bileşenlerine asla aktarılmaz.

## 8. Nesnel Anlatım Üslubu
- Tüm ziyaretçi metinlerinde AI araştırmasını bizzat gidip tatmış gibi sunan birinci şahıs anlatımı ("tattım", "denedim", "gittim", "bayıldık") ve doğrulanamayan süperlatif sıfatlar ("en iyi", "kusursuz", "rakipsiz", "mükemmel", "muhteşem", "1 numara") yasaktır.

## 9. Hafıza / Önbellek Kuralı ve Adım Adım Bölge Kalibrasyonu
- Doğrulanan her mekanın canlı Google Places yanıtı `work/gastronomy-v3/places-cache.json` altında önbelleğe alınır; aynı mekan için gereksiz tekrar sorgu yapılmaz (yalnızca `--refresh` ile tazelenir).
- Algoritma kalibrasyonu tüm bölgelere aynı anda yayılmadan önce referans bölge (`Moda`) üzerinde doğrulanır.
