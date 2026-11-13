# Gastronomi V3.2 Seçim Algoritması ve Kategori Kuralları (`RULES.md`)

Bu doküman `lib/gastronomy-v3` motorunun kalıcı anayasasıdır. Tüm şehir, ilçe ve semt güncellemelerinde istisnasız uygulanır.

---

## 1. Kesin Lokalizasyon (`İl > İlçe > Semt`)
- Her bölge sıkı coğrafi sınır (`bbox`, gerekirse `excludeBbox` ve `allowedNeighborhoodTokens`) ile tanımlanır.
- Komşu semt veya ilçe taşmaları (ör. Erenköy mekanlarının Caddebostan'a, Osmanağa mekanlarının Moda'ya dahil edilmesi) kabul edilmez.
- Google Places canlı koordinatı ve adres bileşenleri semt sınırını doğrulamıyorsa aday otomatik reddedilir.

## 2. Standart 6 Kategori + Konuma Özgü İstisnalar
- Şehir içi ve kıyı/turistik bölgelerde (`profile: 'standard_urban_or_coastal'`) kanonik kategori sırası sabittir:
  1. `pizza` — Pizza
  2. `hamburger` — Hamburger
  3. `kahve` — Kahve
  4. `date-mekanlari` — Date
  5. `kahvalti` — Kahvaltı
  6. `denemelisin` — O Bölgeye Özgü Şeyler Denemelisin
- Gaziantep gibi doğrudan yerel mutfak kimliğiyle anılan özel konumlarda (`profile: 'culinary_heritage'`) standart pizza/hamburger şablonu zorlanmaz; bölgenin en köklü yöresel yemek kategorileri kullanılır.
- Afyonkarahisar (lokum vb.) gibi konuma özgü belirgin bir imza ürün başlığı varsa `extraCategories` ile eklenir.

## 3. Kategori Başına 4 Seçkin Mekan (Dolgu Yasak)
- Her kategoride hedef sayı `maxPerCategory = 4` mekandır.
- Sayıyı 4'e tamamlamak için zincir işletme, vasat alternatif veya düşük kaliteli dolgu mekan eklenmez.
- Bölgede standartları karşılayan gerçekten güçlü mekan yoksa sayı 1-3 arasında kalabilir; hiç nitelikli aday yoksa kategori dinamik olarak gizlenir (ör. Caddebostan Kahvaltı).

## 4. Çoklu Kaynak Uzlaşısı, Marka Sürekliliği & Anti-Manipülasyon
- **Tek başına Google puanıyla seçim yasaktır:** Her mekan için işletme menüsü/sitesi (`operator`), editoryal gastronomi yayınları (`editorial`), yerel topluluk forumları/müdavim paylaşımları (`community`) veya gastronomi ödülleri (`award`) arasından **en az 2 bağımsız kanıt** zorunludur.
- **Zincir bloğu:** `CHAIN_BLOCKLIST` kapsamındaki endüstriyel/yaygın zincirler her koşulda reddedilir.
- **Marka sürekliliği (`expectedBrandWord`):** İsim değiştirmiş, el değiştirmiş veya eski kimliğini kaybetmiş işletmeler (ör. eski *Çekirdek* yerine açılan *Çekirdekhane*) `brand_discontinuity` ile reddedilir.
- **Yerel müdavim / şef / miras koruması:** `communityInsiderProtected` veya `chefOrHeritageProtected` işaretli, en az `200` yoruma sahip ve en az `2` bağımsız editoryal/topluluk/ödül kaynağıyla doğrulanan köklü veya kült mekanlarda `4.2+` Google puanı kabul edilir.
- **Sahte/şişirilmiş puan koruması:** Yorum sayısı `150` altında olup `4.8+` puana sahip mekanlarda bağımsız `editorial`, `community` veya `award` kanıtı bulunmuyorsa `suspected_rating_inflation_no_community_proof` ile reddedilir.

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
